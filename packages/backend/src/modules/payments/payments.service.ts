import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private get sslBase() {
    return process.env.SSLCOMMERZ_IS_SANDBOX === 'true'
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
  }

  async initSSLCommerz(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { name: true, email: true, phone: true } }, address: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

    const params = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: order.total.toString(),
      currency: 'BDT',
      tran_id: order.orderNumber,
      success_url: process.env.SSLCOMMERZ_SUCCESS_URL!,
      fail_url: process.env.SSLCOMMERZ_FAIL_URL!,
      cancel_url: process.env.SSLCOMMERZ_CANCEL_URL!,
      ipn_url: process.env.SSLCOMMERZ_IPN_URL!,
      cus_name: order.user.name,
      cus_email: order.user.email || '',
      cus_phone: order.user.phone || order.address.phone,
      cus_add1: order.address.streetAddress,
      cus_city: order.address.district,
      cus_country: 'Bangladesh',
      ship_name: order.user.name,
      ship_add1: order.address.streetAddress,
      ship_city: order.address.district,
      ship_country: 'Bangladesh',
      product_name: `Order #${order.orderNumber}`,
      product_category: 'Gadgets',
      product_profile: 'physical-goods',
    });

    const response = await axios.post(`${this.sslBase}/gwprocess/v4/api.php`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.status !== 'SUCCESS') {
      throw new BadRequestException('Failed to initialize payment');
    }

    await this.prisma.payment.upsert({
      where: { orderId },
      create: { orderId, method: 'SSLCOMMERZ', amount: order.total, status: 'PENDING' },
      update: { status: 'PENDING' },
    });

    return { data: { gatewayUrl: response.data.GatewayPageURL, sessionKey: response.data.sessionkey } };
  }

  async handleIPN(body: any) {
    const { val_id, tran_id, status, amount } = body;

    if (status !== 'VALID' && status !== 'VALIDATED') return { message: 'Payment failed' };

    // Verify with SSLCommerz
    const verifyUrl = `${this.sslBase}/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`;
    const verifyRes = await axios.get(verifyUrl);

    if (verifyRes.data.status !== 'VALID' && verifyRes.data.status !== 'VALIDATED') {
      return { message: 'Payment verification failed' };
    }

    const order = await this.prisma.order.findFirst({ where: { orderNumber: tran_id } });
    if (!order) return { message: 'Order not found' };

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'PAID', transactionId: val_id, status: 'CONFIRMED' },
    });

    await this.prisma.payment.updateMany({
      where: { orderId: order.id },
      data: { status: 'PAID', transactionId: val_id, gatewayResponse: verifyRes.data, paidAt: new Date() },
    });

    await this.prisma.orderStatusHistory.create({
      data: { orderId: order.id, status: 'CONFIRMED', note: `Payment confirmed via SSLCommerz. TxID: ${val_id}` },
    });

    return { message: 'Payment processed successfully' };
  }

  async verifyPayment(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    return { data: payment };
  }
}
