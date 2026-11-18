import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public() @Get() getActive(@Query('position') position?: string) { return this.bannersService.getActive(position); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Get('admin/all') findAll() { return this.bannersService.findAll(); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Post() create(@Body() dto: any) { return this.bannersService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.bannersService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER) @ApiBearerAuth()
  @Delete(':id') remove(@Param('id') id: string) { return this.bannersService.remove(id); }
}
