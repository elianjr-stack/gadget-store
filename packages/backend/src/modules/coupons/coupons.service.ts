import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, orderAmount: number, userId?: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code, isActive: true } });
    if (!coupon) return { data: { valid: false, message: 'Invalid coupon code' } };
    if (coupon.startsAt && coupon.startsAt > new Date()) return { data: { valid: false, message: 'Coupon not started yet' } };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { data: { valid: false, message: 'Coupon expired' } };
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { data: { valid: false, message: 'Coupon limit reached' } };
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      return { data: { valid: false, message: `Minimum order ৳${coupon.minOrderAmount}` } };
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (orderAmount * Number(coupon.value)) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discount = Math.min(Number(coupon.value), orderAmount);
    }

    return { data: { valid: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } } };
  }

  async findAll(page = 1, limit = 20) {
    const [total, data] = await Promise.all([
      this.prisma.coupon.count(),
      this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(dto: any) {
    const coupon = await this.prisma.coupon.create({ data: dto });
    return { message: 'Coupon created', data: coupon };
  }

  async update(id: string, dto: any) {
    const coupon = await this.prisma.coupon.update({ where: { id }, data: dto });
    return { message: 'Coupon updated', data: coupon };
  }

  async remove(id: string) {
    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted' };
  }
}
