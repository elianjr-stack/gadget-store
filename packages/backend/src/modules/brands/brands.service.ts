import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    const brands = await this.prisma.brand.findMany({
      where,
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { data: brands };
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return { data: brand };
  }

  async create(dto: any) {
    const brand = await this.prisma.brand.create({ data: dto });
    return { message: 'Brand created', data: brand };
  }

  async update(id: string, dto: any) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Brand not found');
    const updated = await this.prisma.brand.update({ where: { id }, data: dto });
    return { message: 'Brand updated', data: updated };
  }

  async remove(id: string) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Brand not found');
    await this.prisma.brand.delete({ where: { id } });
    return { message: 'Brand deleted' };
  }
}
