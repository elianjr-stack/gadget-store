import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, discountPrice: true,
            stockStatus: true, stockQuantity: true, emiAvailable: true,
            images: { where: { isMain: true }, take: 1 },
            brand: { select: { name: true } },
          },
        },
        variant: { select: { id: true, name: true, type: true, price: true, discountPrice: true, stockStatus: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.variant?.price || item.product.discountPrice || item.product.price);
      return sum + price * item.quantity;
    }, 0);

    return { data: { items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) } };
  }

  async addItem(userId: string, productId: string, variantId?: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stockStatus === 'OUT_OF_STOCK') throw new BadRequestException('Product is out of stock');

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId_variantId: { userId, productId, variantId: variantId ?? '' } },
    });

    if (existing) {
      const updated = await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return { message: 'Cart updated', data: updated };
    }

    const item = await this.prisma.cartItem.create({
      data: { userId, productId, variantId, quantity },
    });
    return { message: 'Added to cart', data: item };
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    const updated = await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    return { message: 'Cart item updated', data: updated };
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  }
}
