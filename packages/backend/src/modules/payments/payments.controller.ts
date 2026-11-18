import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Post('sslcommerz/init') initSSL(@Body('orderId') orderId: string) { return this.paymentsService.initSSLCommerz(orderId); }

  @Public() @Post('ipn') handleIPN(@Body() body: any) { return this.paymentsService.handleIPN(body); }
  @Public() @Post('sslcommerz/success') handleSuccess(@Body() body: any) { return this.paymentsService.handleIPN(body); }
  @Public() @Post('sslcommerz/fail') handleFail(@Body() _: any) { return { message: 'Payment failed' }; }
  @Public() @Post('sslcommerz/cancel') handleCancel(@Body() _: any) { return { message: 'Payment cancelled' }; }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Get(':orderId/verify') verify(@Param('orderId') orderId: string) { return this.paymentsService.verifyPayment(orderId); }
}
