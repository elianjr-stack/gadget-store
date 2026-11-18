import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const where = { productId, isApproved: true };
    const [total, data] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const allRatings = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { productId, isApproved: true },
      _count: { rating: true },
    });

    const distribution = [1, 2, 3, 4, 5].map((r) => ({
      rating: r,
      count: allRatings.find((a) => a.rating === r)?._count.rating || 0,
    }));

    const avgResult = await this.prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: {
        average: Number(avgResult._avg.rating?.toFixed(1) || 0),
        total: avgResult._count.rating,
        distribution,
      },
    };
  }

  async createReview(userId: string, dto: { productId: string; rating: number; title?: string; comment?: string; images?: string[] }) {
    if (dto.rating < 1 || dto.rating > 5) throw new BadRequestException('Rating must be 1-5');

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });
    if (existing) throw new ConflictException('You have already reviewed this product');

    const review = await this.prisma.review.create({
      data: { userId, ...dto },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // Update product average rating
    const stats = await this.prisma.review.aggregate({
      where: { productId: dto.productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: {
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count.rating,
      },
    });

    return { message: 'Review submitted', data: review };
  }

  async voteHelpful(reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } },
    });
    return { message: 'Voted helpful', data: updated };
  }

  async getAdminReviews(page = 1, limit = 20, isApproved?: boolean) {
    const where = isApproved !== undefined ? { isApproved } : {};
    const [total, data] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async approveReview(id: string) {
    const review = await this.prisma.review.update({ where: { id }, data: { isApproved: true } });
    return { message: 'Review approved', data: review };
  }

  async deleteReview(id: string) {
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted' };
  }
}
