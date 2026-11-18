import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public() @Get() findAll() { return this.categoriesService.findAll(); }
  @Public() @Get('flat') findAllFlat() { return this.categoriesService.findAllFlat(); }
  @Public() @Get(':slug') findOne(@Param('slug') slug: string) { return this.categoriesService.findBySlug(slug); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Post()
  create(@Body() dto: any) { return this.categoriesService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.categoriesService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.categoriesService.remove(id); }
}
