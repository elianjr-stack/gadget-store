import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.MANAGER)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get('dashboard') getDashboard() { return this.analyticsService.getDashboard(); }
  @Get('sales') getSales(@Query('period') period = '30d', @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return this.analyticsService.getSalesReport(period, dateFrom, dateTo);
  }
  @Get('profit-loss') getProfitLoss(@Query('period') period = '30d', @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return this.analyticsService.getProfitLoss(period, dateFrom, dateTo);
  }
  @Get('inventory-valuation') getInventoryValuation() {
    return this.analyticsService.getInventoryValuation();
  }
}
