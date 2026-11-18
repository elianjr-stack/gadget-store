import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async getActive(position?: string) {
    const now = new Date();
    const where: any = {
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    };
    if (position) where.position = position;
    const banners = await this.prisma.banner.findMany({ where, orderBy: { sortOrder: 'asc' } });
    return { data: banners };
  }

  async findAll() {
    const banners = await this.prisma.banner.findMany({ orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }] });
    return { data: banners };
  }

  async create(dto: any) {
    const banner = await this.prisma.banner.create({ data: dto });
    return { message: 'Banner created', data: banner };
  }

  async update(id: string, dto: any) {
    const banner = await this.prisma.banner.update({ where: { id }, data: dto });
    return { message: 'Banner updated', data: banner };
  }

  async remove(id: string) {
    await this.prisma.banner.delete({ where: { id } });
    return { message: 'Banner deleted' };
  }
}
