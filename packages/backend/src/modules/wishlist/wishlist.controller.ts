import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Get() get(@CurrentUser('sub') userId: string) { return this.wishlistService.getWishlist(userId); }
  @Post() add(@CurrentUser('sub') userId: string, @Body('productId') productId: string) { return this.wishlistService.addItem(userId, productId); }
  @Delete(':productId') remove(@CurrentUser('sub') userId: string, @Param('productId') productId: string) { return this.wishlistService.removeItem(userId, productId); }
}
