import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateProductDto, ProductQueryDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import * as Papa from 'papaparse';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      search, brandId, brandSlug, categoryId, categorySlug,
      minPrice, maxPrice, stockStatus, sortBy = 'createdAt',
      sortOrder = 'desc', isFeatured, isFlashDeal, isNewArrival,
      isBestSeller, page = 1, limit = 20, minRating,
    } = query;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameBn: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (brandSlug) where.brand = { slug: brandSlug };
    if (categoryId) where.categoryId = categoryId;
    if (categorySlug) where.category = { slug: categorySlug };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (stockStatus) where.stockStatus = stockStatus;
    if (isFeatured === 'true') where.isFeatured = true;
    if (isFlashDeal === 'true') where.isFlashDeal = true;
    if (isNewArrival === 'true') where.isNewArrival = true;
    if (isBestSeller === 'true') where.isBestSeller = true;
    if (minRating) where.avgRating = { gte: minRating };

    const validSortFields = ['price', 'name', 'createdAt', 'soldCount', 'avgRating', 'viewCount'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        select: {
          id: true, name: true, nameBn: true, slug: true, sku: true,
          price: true, discountPrice: true, discountPercent: true,
          stockStatus: true, stockQuantity: true,
          avgRating: true, reviewCount: true, soldCount: true,
          isNewArrival: true, isFlashDeal: true, isBestSeller: true,
          flashDealEnds: true, emiAvailable: true,
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          category: { select: { id: true, name: true, slug: true } },
          images: { where: { isMain: true }, take: 1, select: { url: true, alt: true } },
          createdAt: true,
        },
        orderBy: { [orderByField]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    // Increment view count asynchronously
    this.prisma.product.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
        specifications: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        priceHistory: { orderBy: { createdAt: 'desc' }, take: 30 },
        relatedFrom: {
          include: {
            related: {
              select: {
                id: true, name: true, slug: true, price: true, discountPrice: true,
                avgRating: true, reviewCount: true, stockStatus: true,
                images: { where: { isMain: true }, take: 1 },
                brand: { select: { name: true } },
              },
            },
          },
          take: 8,
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }

  async searchSuggest(q: string) {
    const results = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { nameBn: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: {
        name: true, nameBn: true, slug: true, price: true, discountPrice: true,
        images: { where: { isMain: true }, take: 1, select: { url: true } },
        brand: { select: { name: true } },
      },
      take: 8,
    });

    return { data: results };
  }

  async create(dto: CreateProductDto, adminId: string) {
    const existing = await this.prisma.product.findFirst({
      where: { OR: [{ slug: dto.slug }, { sku: dto.sku }] },
    });
    if (existing) throw new ConflictException('Slug or SKU already exists');

    const { images, variants, specifications, ...productData } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        price: productData.price as any,
        discountPrice: productData.discountPrice as any,
        costPrice: productData.costPrice as any,
        weight: productData.weight as any,
        images: images
          ? { create: images.map((img, i) => ({ ...img, sortOrder: i })) }
          : undefined,
        variants: variants
          ? { create: variants.map((v, i) => ({ ...v, type: v.type as any, sortOrder: i, price: v.price as any })) }
          : undefined,
        specifications: specifications
          ? { create: specifications }
          : undefined,
      },
    });

    // Record initial price
    await this.prisma.priceHistory.create({
      data: {
        productId: product.id,
        price: dto.price as any,
        discountPrice: dto.discountPrice as any,
        changedBy: adminId,
      },
    });

    await this.invalidateCache();
    return { message: 'Product created', data: product };
  }

  async update(id: string, dto: Partial<CreateProductDto>, adminId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const { images, variants, specifications, ...updateData } = dto;

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price as any,
        discountPrice: updateData.discountPrice as any,
        costPrice: updateData.costPrice as any,
      },
    });

    // Record price history if price changed
    if (dto.price && Number(dto.price) !== Number(product.price)) {
      await this.prisma.priceHistory.create({
        data: {
          productId: id,
          price: dto.price as any,
          discountPrice: dto.discountPrice as any,
          changedBy: adminId,
        },
      });
    }

    await this.invalidateCache();
    return { message: 'Product updated', data: updated };
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id } });
    await this.invalidateCache();
    return { message: 'Product deleted' };
  }

  async bulkImport(fileBuffer: Buffer, adminId: string) {
    const content = fileBuffer.toString('utf-8');
    const { data: rows } = Papa.parse(content, { header: true, skipEmptyLines: true });

    const results = { imported: 0, skipped: 0, errors: [] as string[] };

    for (const row of rows as any[]) {
      try {
        const existing = await this.prisma.product.findFirst({
          where: { OR: [{ sku: row.sku }, { slug: row.slug }] },
        });
        if (existing) { results.skipped++; continue; }

        const brand = await this.prisma.brand.findFirst({
          where: { name: { equals: row.brand, mode: 'insensitive' } },
        });
        const category = await this.prisma.category.findFirst({
          where: { name: { equals: row.category, mode: 'insensitive' } },
        });

        if (!brand || !category) {
          results.errors.push(`Row ${results.imported + results.skipped + 1}: Brand/Category not found`);
          continue;
        }

        await this.prisma.product.create({
          data: {
            name: row.name,
            slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
            sku: row.sku,
            brandId: brand.id,
            categoryId: category.id,
            price: parseFloat(row.price) as any,
            discountPrice: row.discountPrice ? parseFloat(row.discountPrice) as any : undefined,
            stockQuantity: parseInt(row.stockQuantity) || 0,
            stockStatus: (row.stockStatus as any) || 'IN_STOCK',
            shortDescription: row.shortDescription,
            description: row.description,
            warrantyMonths: row.warrantyMonths ? parseInt(row.warrantyMonths) : undefined,
          },
        });
        results.imported++;
      } catch (err: any) {
        results.errors.push(`Row error: ${err.message}`);
      }
    }

    await this.invalidateCache();
    return { data: results };
  }

  async getAdminProducts(query: ProductQueryDto) {
    const { search, brandId, categoryId, stockStatus, page = 1, limit = 20 } = query;

    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (stockStatus) where.stockStatus = stockStatus;

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        select: {
          id: true, name: true, sku: true, slug: true,
          price: true, discountPrice: true,
          stockStatus: true, stockQuantity: true, lowStockThreshold: true,
          isActive: true, isFeatured: true, soldCount: true, avgRating: true,
          brand: { select: { name: true, logo: true } },
          category: { select: { name: true } },
          images: { where: { isMain: true }, take: 1 },
          createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getLowStockProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stockStatus: 'IN_STOCK',
        stockQuantity: { lte: this.prisma.product.fields.lowStockThreshold as any },
      },
      select: {
        id: true, name: true, sku: true, stockQuantity: true, lowStockThreshold: true,
        brand: { select: { name: true } },
        images: { where: { isMain: true }, take: 1 },
      },
      take: 20,
    });
    return { data: products };
  }

  private async invalidateCache() {
    await this.redis.del('products:*').catch(() => {});
  }
}
