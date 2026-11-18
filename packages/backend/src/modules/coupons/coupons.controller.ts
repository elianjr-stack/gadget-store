import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard) @ApiBearerAuth() @Post('validate')
  validate(@Body() body: { code: string; orderAmount: number }) { return this.couponsService.validate(body.code, body.orderAmount); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') { return this.couponsService.findAll(+page, +limit); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Post() create(@Body() dto: any) { return this.couponsService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.couponsService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Delete(':id') remove(@Param('id') id: string) { return this.couponsService.remove(id); }
}
