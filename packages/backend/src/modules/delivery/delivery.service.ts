import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async calculateCharge(zone: string, orderAmount?: number) {
    const charge = await this.prisma.deliveryCharge.findFirst({
      where: { zone: zone as any, isActive: true },
    });
    if (!charge) return { data: { charge: 0 } };

    let deliveryFee = Number(charge.charge);
    if (charge.freeAbove && orderAmount && orderAmount >= Number(charge.freeAbove)) {
      deliveryFee = 0;
    }
    return { data: { charge: deliveryFee, freeAbove: charge.freeAbove } };
  }

  async getDistricts() {
    const districts = await this.prisma.district.findMany({ orderBy: [{ division: 'asc' }, { name: 'asc' }] });
    return { data: districts };
  }

  async getCharges() {
    const charges = await this.prisma.deliveryCharge.findMany({ where: { isActive: true } });
    return { data: charges };
  }

  async updateCharge(id: string, dto: any) {
    const updated = await this.prisma.deliveryCharge.update({ where: { id }, data: dto });
    return { message: 'Delivery charge updated', data: updated };
  }
}
