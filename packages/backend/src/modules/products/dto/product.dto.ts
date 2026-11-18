import {
  IsString, IsOptional, IsNumber, IsBoolean, IsArray,
  IsEnum, Min, IsDateString, IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StockStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() nameBn?: string;
  @IsString() slug: string;
  @IsString() sku: string;
  @IsString() brandId: string;
  @IsString() categoryId: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() shortDescriptionBn?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() descriptionBn?: string;
  @Type(() => Number) @IsNumber() price: number;
  @IsOptional() @Type(() => Number) @IsNumber() discountPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() discountPercent?: number;
  @IsOptional() @Type(() => Number) @IsNumber() costPrice?: number;
  @IsOptional() @IsEnum(StockStatus) stockStatus?: StockStatus;
  @IsOptional() @Type(() => Number) @IsInt() stockQuantity?: number;
  @IsOptional() @Type(() => Number) @IsInt() lowStockThreshold?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isNewArrival?: boolean;
  @IsOptional() @IsBoolean() isBestSeller?: boolean;
  @IsOptional() @IsBoolean() isFlashDeal?: boolean;
  @IsOptional() @IsDateString() flashDealEnds?: string;
  @IsOptional() @IsDateString() preOrderDate?: string;
  @IsOptional() @Type(() => Number) @IsInt() warrantyMonths?: number;
  @IsOptional() @IsString() warrantyTerms?: string;
  @IsOptional() @IsBoolean() emiAvailable?: boolean;
  @IsOptional() @IsArray() emiMonths?: number[];
  @IsOptional() @Type(() => Number) @IsNumber() weight?: number;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() images?: { url: string; alt?: string; isMain?: boolean }[];
  @IsOptional() @IsArray() variants?: {
    type: string; name: string; value: string; price?: number;
    discountPrice?: number; sku?: string; stock?: number; image?: string; isDefault?: boolean;
  }[];
  @IsOptional() @IsArray() specifications?: {
    group: string; groupBn?: string; name: string; nameBn?: string;
    value: string; valueBn?: string; sortOrder?: number;
  }[];
}

export class UpdateProductDto extends CreateProductDto {}

export class ProductQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brandId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brandSlug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categorySlug?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() maxPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsEnum(StockStatus) stockStatus?: StockStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortOrder?: 'asc' | 'desc';
  @ApiPropertyOptional() @IsOptional() @IsString() isFeatured?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() isFlashDeal?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() isNewArrival?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() isBestSeller?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minRating?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
}
