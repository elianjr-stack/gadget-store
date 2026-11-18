import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          include: { children: { where: { isActive: true } } },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return { data: categories };
  }

  async findAllFlat() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { data: categories };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        parent: true,
        specs: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return { data: category };
  }

  async create(dto: any) {
    const category = await this.prisma.category.create({ data: dto });
    return { message: 'Category created', data: category };
  }

  async update(id: string, dto: any) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    const updated = await this.prisma.category.update({ where: { id }, data: dto });
    return { message: 'Category updated', data: updated };
  }

  async remove(id: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}
