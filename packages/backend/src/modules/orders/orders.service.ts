import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GS-${dateStr}-${random}`;
  }

  async createOrder(userId: string | undefined, dto: any) {
    let effectiveUserId = userId;
    let address: any = null;

    if (!effectiveUserId || dto.addressId === 'guest-address-id' || !dto.addressId) {
      const guestPhone = dto.guestPhone || dto.shippingAddress?.phone || '01700000000';
      const guestEmail = dto.guestEmail || dto.shippingAddress?.email || `guest_${Date.now()}@zynoxgadgets.com`;
      const guestName = dto.guestName || dto.shippingAddress?.fullName || 'Guest Customer';

      let user = await this.prisma.user.findFirst({
        where: { OR: [{ phone: guestPhone }, { email: guestEmail }] },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: guestName,
            phone: guestPhone,
            email: guestEmail,
            password: Math.random().toString(36).slice(-8),
            role: 'CUSTOMER',
          },
        });
      }
      effectiveUserId = user.id;

      address = await this.prisma.address.findFirst({
        where: { userId: effectiveUserId },
      });

      if (!address) {
        address = await this.prisma.address.create({
          data: {
            userId: effectiveUserId,
            fullName: guestName,
            phone: guestPhone,
            division: dto.shippingAddress?.division || 'Dhaka',
            district: dto.shippingAddress?.district || dto.district || 'Dhaka',
            area: dto.shippingAddress?.city || dto.district || 'Dhaka',
            streetAddress: dto.shippingAddress?.address || dto.streetAddress || 'Bangladesh',
            deliveryZone: dto.deliveryZone || 'DHAKA',
            isDefault: true,
          },
        });
      }
      dto.addressId = address.id;
    } else {
      address = await this.prisma.address.findFirst({ where: { id: dto.addressId, userId: effectiveUserId } });
      if (!address) throw new NotFoundException('Address not found');
    }

    // Resolve items and prices
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: { images: { where: { isMain: true }, take: 1 } },
      });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stockStatus === 'OUT_OF_STOCK') throw new BadRequestException(`${product.name} is out of stock`);

      let price = Number(product.discountPrice || product.price);
      let name = product.name;
      let sku = product.sku;

      if (item.variantId) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id: item.variantId } });
        if (variant) {
          price = Number(variant.discountPrice || variant.price || price);
          name = `${name} - ${variant.name}`;
          sku = variant.sku || sku;
        }
      }

      const total = price * item.quantity;
      subtotal += total;
      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name,
        sku,
        price,
        quantity: item.quantity,
        total,
        image: product.images[0]?.url,
      });
    }

    // Apply coupon
    let discount = 0;
    let couponId: string | undefined;
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode, isActive: true } });
      if (!coupon) throw new BadRequestException('Invalid coupon code');
      if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestException('Coupon expired');
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(`Minimum order amount is ৳${coupon.minOrderAmount}`);
      }
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
      if (coupon.type === 'PERCENTAGE') {
        discount = (subtotal * Number(coupon.value)) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
      } else if (coupon.type === 'FIXED_AMOUNT') {
        discount = Math.min(Number(coupon.value), subtotal);
      }
      couponId = coupon.id;
      await this.prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
    }

    // Delivery charge
    const deliveryCharge = await this.prisma.deliveryCharge.findFirst({
      where: { zone: address.deliveryZone, isActive: true },
    });
    let delivery = Number(deliveryCharge?.charge || 0);
    if (deliveryCharge?.freeAbove && subtotal >= Number(deliveryCharge.freeAbove)) delivery = 0;

    const total = subtotal - discount + delivery;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId: effectiveUserId,
        addressId: dto.addressId,
        subtotal: subtotal as any,
        deliveryCharge: delivery as any,
        discount: discount as any,
        couponId,
        total: total as any,
        paymentMethod: dto.paymentMethod,
        note: dto.note,
        isGuestOrder: !userId,
        guestEmail: dto.guestEmail,
        guestPhone: dto.guestPhone,
        deliveryZone: address.deliveryZone,
        items: { create: orderItems },
        statusHistory: { create: { status: 'PENDING', note: 'Order placed' } },
      },
      include: { items: true, address: true },
    });

    // Clear cart if registered user
    if (userId) {
      await this.prisma.cartItem.deleteMany({ where: { userId } }).catch(() => {});
    }

    // Update sold count
    for (const item of dto.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity } },
      }).catch(() => {});
    }

    return { message: 'Order placed successfully', data: order };
  }

  async getMyOrders(userId: string, page = 1, limit = 10, status?: OrderStatus) {
    const where: any = { userId };
    if (status) where.status = status;

    const [total, data] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        select: {
          id: true, orderNumber: true, status: true, paymentStatus: true,
          paymentMethod: true, total: true, deliveryCharge: true, discount: true,
          createdAt: true, deliveredAt: true, trackingNumber: true, courierName: true,
          items: { select: { name: true, quantity: true, price: true, image: true }, take: 3 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getOrderDetail(id: string, userId: string, userRole: string) {
    const where: any = { id };
    if (!['OWNER', 'MANAGER', 'STAFF'].includes(userRole)) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: { include: { product: { select: { slug: true } } } },
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        payment: true,
        returnRequest: true,
        warrantyClaims: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return { data: order };
  }

  async updateStatus(orderId: string, status: OrderStatus, note?: string, trackingNumber?: string, courierName?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        courierName: courierName || order.courierName,
        deliveredAt: status === 'DELIVERED' ? new Date() : order.deliveredAt,
        cancelledAt: status === 'CANCELLED' ? new Date() : order.cancelledAt,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: { orderId, status, note },
    });

    return { message: 'Order status updated', data: updated };
  }

  async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: reason },
    });
    await this.prisma.orderStatusHistory.create({
      data: { orderId, status: 'CANCELLED', note: reason },
    });
    return { message: 'Order cancelled', data: updated };
  }

  async getAllOrders(query: any) {
    const pageNum = Math.max(1, Number(query.page) || 1);
    const limitNum = Math.max(1, Number(query.limit) || 20);
    const { status, paymentStatus, search, dateFrom, dateTo } = query;
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search } } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        select: {
          id: true, orderNumber: true, status: true, paymentStatus: true,
          paymentMethod: true, total: true, deliveryZone: true, createdAt: true,
          user: { select: { id: true, name: true, phone: true } },
          items: { select: { name: true, quantity: true }, take: 2 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);
    return { data, meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
  }
}
