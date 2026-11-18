import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [PrismaModule, AuthModule], controllers: [BrandsController], providers: [BrandsService], exports: [BrandsService] })
export class BrandsModule {}
