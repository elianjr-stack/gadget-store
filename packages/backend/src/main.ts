import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  });

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Zynox Gadgets API')
    .setDescription('Zynox Gadgets Bangladesh - Enterprise Gadget E-Commerce REST API')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & 2FA')
    .addTag('Users', 'User & Customer Management')
    .addTag('Products', 'Product Catalog & Inventory')
    .addTag('Categories', 'Product Categories')
    .addTag('Brands', 'Brand Catalog & Dynamic Color System')
    .addTag('Expenses', 'Business Expenses & Cash Flow')
    .addTag('Orders', 'Order Management & Tracking')
    .addTag('Cart', 'Shopping Cart')
    .addTag('Wishlist', 'Customer Wishlist')
    .addTag('Reviews', 'Verified Reviews & Ratings')
    .addTag('Coupons', 'Coupons & Promotional Discounts')
    .addTag('Banners', 'CMS Banners & Campaigns')
    .addTag('Payments', 'bKash, Nagad, SSLCommerz, COD')
    .addTag('Delivery', 'Pathao, Steadfast, RedX Logistics')
    .addTag('Upload', 'Image & Media CDN Uploads')
    .addTag('Analytics', 'Sales, Profit & Loss, Inventory Valuation')
    .addTag('Notifications', 'SMS & Push Notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Zynox Gadgets API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
