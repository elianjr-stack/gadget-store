import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true, avatar: true,
        language: true, role: true, createdAt: true,
        _count: { select: { orders: true, wishlistItems: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return { data: user };
  }

  async updateProfile(userId: string, dto: { name?: string; avatar?: string; language?: string }) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: dto, select: { id: true, name: true, avatar: true, language: true } });
    return { message: 'Profile updated', data: user };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new ForbiddenException('Old password is incorrect');
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: 'Password changed successfully' };
  }

  // Addresses
  async getAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
    return { data: addresses };
  }

  async createAddress(userId: string, dto: any) {
    if (dto.isDefault) await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const address = await this.prisma.address.create({ data: { userId, ...dto } });
    return { message: 'Address added', data: address };
  }

  async updateAddress(userId: string, addressId: string, dto: any) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');
    if (dto.isDefault) await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const updated = await this.prisma.address.update({ where: { id: addressId }, data: dto });
    return { message: 'Address updated', data: updated };
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');
    await this.prisma.address.delete({ where: { id: addressId } });
    return { message: 'Address deleted' };
  }

  // Admin - User management
  async getAllUsers(page = 1, limit = 20, search?: string, role?: string) {
    const where: any = {};
    if (role) where.role = role;
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          isActive: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.prisma.user.update({ where: { id }, data: { role: role as any }, select: { id: true, name: true, role: true } });
    return { message: 'Role updated', data: user };
  }

  async toggleUserActive(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: !user.isActive }, select: { id: true, name: true, isActive: true } });
    return { message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, data: updated };
  }

  async getActivityLogs(page = 1, limit = 20, userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    const [total, data] = await Promise.all([
      this.prisma.activityLog.count({ where }),
      this.prisma.activityLog.findMany({
        where,
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
