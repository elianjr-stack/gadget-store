import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Public() @Post('calculate') calculate(@Body() body: { zone: string; orderAmount?: number }) {
    return this.deliveryService.calculateCharge(body.zone, body.orderAmount);
  }
  @Public() @Get('districts') getDistricts() { return this.deliveryService.getDistricts(); }
  @Public() @Get('charges') getCharges() { return this.deliveryService.getCharges(); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Patch('charges/:id') updateCharge(@Param('id') id: string, @Body() dto: any) { return this.deliveryService.updateCharge(id, dto); }
}
