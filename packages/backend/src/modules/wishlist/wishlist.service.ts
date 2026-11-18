import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, name: true, nameBn: true, slug: true, price: true, discountPrice: true,
            stockStatus: true, avgRating: true, reviewCount: true,
            images: { where: { isMain: true }, take: 1 },
            brand: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { data: items };
  }

  async addItem(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) throw new ConflictException('Already in wishlist');

    const item = await this.prisma.wishlistItem.create({ data: { userId, productId } });
    return { message: 'Added to wishlist', data: item };
  }

  async removeItem(userId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    return { message: 'Removed from wishlist' };
  }
}
