import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get() getCart(@CurrentUser('sub') userId: string) { return this.cartService.getCart(userId); }

  @Post() addItem(@CurrentUser('sub') userId: string, @Body() body: { productId: string; variantId?: string; quantity?: number }) {
    return this.cartService.addItem(userId, body.productId, body.variantId, body.quantity);
  }

  @Patch(':id') updateItem(@CurrentUser('sub') userId: string, @Param('id') id: string, @Body('quantity') quantity: number) {
    return this.cartService.updateItem(userId, id, quantity);
  }

  @Delete() clearCart(@CurrentUser('sub') userId: string) { return this.cartService.clearCart(userId); }

  @Delete(':id') removeItem(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.cartService.removeItem(userId, id);
  }
}
