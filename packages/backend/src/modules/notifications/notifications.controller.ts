import { Controller, Get, Post, Patch, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get() get(@CurrentUser('sub') userId: string, @Query('isRead') isRead?: string) {
    return this.notificationsService.getMyNotifications(userId, isRead !== undefined ? isRead === 'true' : undefined);
  }
  @Patch(':id/read') markRead(@CurrentUser('sub') userId: string, @Param('id') id: string) { return this.notificationsService.markRead(userId, id); }
  @Patch('read-all') markAllRead(@CurrentUser('sub') userId: string) { return this.notificationsService.markAllRead(userId); }
  @Post('stock-alert') subscribe(@CurrentUser('sub') userId: string, @Body('productId') productId: string) { return this.notificationsService.subscribeStockAlert(userId, productId); }
  @Delete('stock-alert/:productId') unsubscribe(@CurrentUser('sub') userId: string, @Param('productId') productId: string) { return this.notificationsService.unsubscribeStockAlert(userId, productId); }
}
