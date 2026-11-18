import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders, todayOrders, totalRevenue, totalProducts,
      totalCustomers, pendingOrders, lowStockProducts, recentOrders,
    ] = await Promise.all([
      this.prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      this.prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.product.findMany({
        where: { isActive: true, stockQuantity: { lte: 5 }, stockStatus: 'IN_STOCK' },
        select: { id: true, name: true, sku: true, stockQuantity: true, images: { take: 1, where: { isMain: true } } },
        take: 10,
      }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true, orderNumber: true, status: true, total: true,
          paymentMethod: true, createdAt: true,
          user: { select: { name: true } },
          items: { take: 1, select: { name: true } },
        },
      }),
    ]);

    // Revenue chart – last 30 days
    const revenueSeries = await this.prisma.$queryRaw<{ date: string; revenue: number; orders: number }[]>`
      SELECT DATE(created_at)::text as date,
             COALESCE(SUM(total), 0)::float as revenue,
             COUNT(*)::int as orders
      FROM orders
      WHERE created_at >= ${last30} AND payment_status = 'PAID'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Top brands
    const topBrands = await this.prisma.brand.findMany({
      take: 6,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { products: { _count: 'desc' } },
    });

    return {
      data: {
        stats: {
          totalRevenue: Number(totalRevenue._sum.total || 0),
          totalOrders, todayOrders, totalProducts, totalCustomers, pendingOrders,
        },
        recentOrders,
        revenueSeries,
        topBrands,
        lowStockProducts,
      },
    };
  }

  async getSalesReport(period = '30d', dateFrom?: string, dateTo?: string) {
    let from: Date;
    let to = dateTo ? new Date(dateTo) : new Date();

    if (dateFrom) {
      from = new Date(dateFrom);
    } else {
      const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
      from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const [stats, ordersByStatus, paymentMethods, topProducts] = await Promise.all([
      this.prisma.order.aggregate({
        where: { createdAt: { gte: from, lte: to }, paymentStatus: 'PAID' },
        _sum: { total: true },
        _count: { _all: true },
        _avg: { total: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { status: true },
      }),
      this.prisma.order.groupBy({
        by: ['paymentMethod'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { paymentMethod: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { createdAt: { gte: from, lte: to }, paymentStatus: 'PAID' } },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: 'desc' } },
        take: 10,
      }),
    ]);

    const topProductDetails = await Promise.all(
      topProducts.map(async (p) => {
        const product = await this.prisma.product.findUnique({
          where: { id: p.productId },
          select: { name: true, sku: true, images: { take: 1, where: { isMain: true } } },
        });
        return { ...p, product };
      }),
    );

    return {
      data: {
        revenue: Number(stats._sum.total || 0),
        orders: stats._count._all,
        avgOrderValue: Number(stats._avg.total || 0),
        ordersByStatus,
        paymentMethods,
        topProducts: topProductDetails,
      },
    };
  }

  async getProfitLoss(period = '30d', dateFrom?: string, dateTo?: string) {
    let from: Date;
    let to = dateTo ? new Date(dateTo) : new Date();

    if (dateFrom) {
      from = new Date(dateFrom);
    } else {
      const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
      from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: from, lte: to }, paymentStatus: 'PAID' },
      include: {
        items: {
          include: {
            product: { select: { costPrice: true, price: true } },
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalCogs = 0;

    for (const ord of orders) {
      totalRevenue += Number(ord.total);
      for (const it of ord.items) {
        const itemCost = it.product?.costPrice ? Number(it.product.costPrice) : Number(it.price) * 0.8;
        totalCogs += itemCost * it.quantity;
      }
    }

    const grossProfit = totalRevenue - totalCogs;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const expensesAgg = await this.prisma.expense.aggregate({
      where: { date: { gte: from, lte: to } },
      _sum: { amount: true },
    });
    const totalExpenses = Number(expensesAgg._sum.amount || 0);

    const expensesByCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      where: { date: { gte: from, lte: to } },
      _sum: { amount: true },
      _count: { id: true },
    });

    const netProfit = grossProfit - totalExpenses;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      data: {
        period,
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        summary: {
          revenue: totalRevenue,
          costOfGoodsSold: totalCogs,
          grossProfit,
          grossMarginPercent: Number(grossMargin.toFixed(2)),
          operatingExpenses: totalExpenses,
          netProfit,
          netMarginPercent: Number(netMargin.toFixed(2)),
        },
        expensesBreakdown: expensesByCategory.map((e) => ({
          category: e.category,
          amount: Number(e._sum.amount || 0),
          count: e._count.id,
        })),
      },
    };
  }

  async getInventoryValuation() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        barcode: true,
        stockQuantity: true,
        price: true,
        costPrice: true,
        brand: { select: { name: true, brandColor: true } },
      },
    });

    let totalUnits = 0;
    let totalCostValue = 0;
    let totalRetailValue = 0;

    for (const p of products) {
      const qty = p.stockQuantity || 0;
      const cost = p.costPrice ? Number(p.costPrice) : Number(p.price) * 0.8;
      const retail = Number(p.price);

      totalUnits += qty;
      totalCostValue += cost * qty;
      totalRetailValue += retail * qty;
    }

    const projectedProfit = totalRetailValue - totalCostValue;

    return {
      data: {
        totalProducts: products.length,
        totalUnits,
        totalCostValue,
        totalRetailValue,
        projectedProfit,
        potentialMarginPercent: totalRetailValue > 0 ? Number(((projectedProfit / totalRetailValue) * 100).toFixed(2)) : 0,
      },
    };
  }
}
