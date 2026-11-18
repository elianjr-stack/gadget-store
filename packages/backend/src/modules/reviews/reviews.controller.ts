import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public() @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string, @Query('page') page = '1', @Query('limit') limit = '10') {
    return this.reviewsService.getProductReviews(productId, +page, +limit);
  }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth() @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: any) { return this.reviewsService.createReview(userId, dto); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth() @Post(':id/helpful')
  helpful(@Param('id') id: string) { return this.reviewsService.voteHelpful(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Get('admin') getAdmin(@Query('page') page = '1', @Query('limit') limit = '20', @Query('isApproved') isApproved?: string) {
    return this.reviewsService.getAdminReviews(+page, +limit, isApproved !== undefined ? isApproved === 'true' : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Patch(':id/approve') approve(@Param('id') id: string) { return this.reviewsService.approveReview(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Delete(':id') remove(@Param('id') id: string) { return this.reviewsService.deleteReview(id); }
}
