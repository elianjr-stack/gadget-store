import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { OrderStatus, UserRole } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my') getMyOrders(@CurrentUser('sub') userId: string, @Query('page') page = '1', @Query('limit') limit = '10', @Query('status') status?: OrderStatus) {
    return this.ordersService.getMyOrders(userId, +page, +limit, status);
  }

  @Get('my/:id') getMyOrder(@CurrentUser('sub') userId: string, @CurrentUser('role') role: string, @Param('id') id: string) {
    return this.ordersService.getOrderDetail(id, userId, role);
  }

  @Post('my/:id/cancel') cancelOrder(@CurrentUser('sub') userId: string, @Param('id') id: string, @Body('reason') reason: string) {
    return this.ordersService.cancelOrder(id, userId, reason);
  }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @Get() getAllOrders(@Query() query: any) { return this.ordersService.getAllOrders(query); }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @Get(':id') getOrder(@CurrentUser('sub') userId: string, @CurrentUser('role') role: string, @Param('id') id: string) {
    return this.ordersService.getOrderDetail(id, userId, role);
  }

  @UseGuards(RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus; note?: string; trackingNumber?: string; courierName?: string }) {
    return this.ordersService.updateStatus(id, body.status, body.note, body.trackingNumber, body.courierName);
  }
}
