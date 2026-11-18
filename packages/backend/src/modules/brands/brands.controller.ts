import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public() @Get() findAll(@Query('isActive') isActive?: string) {
    return this.brandsService.findAll(isActive === 'true' ? true : isActive === 'false' ? false : undefined);
  }
  @Public() @Get(':slug') findOne(@Param('slug') slug: string) { return this.brandsService.findBySlug(slug); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Post() create(@Body() dto: any) { return this.brandsService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.brandsService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Delete(':id') remove(@Param('id') id: string) { return this.brandsService.remove(id); }
}
