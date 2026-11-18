import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateExpenseDto {
  title: string;
  category: string;
  amount: number;
  date?: string | Date;
  paymentMethod?: string;
  notes?: string;
  referenceNo?: string;
}

export interface UpdateExpenseDto {
  title?: string;
  category?: string;
  amount?: number;
  date?: string | Date;
  paymentMethod?: string;
  notes?: string;
  referenceNo?: string;
}

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, startDate, endDate } = query;
    const pageNum = Math.max(1, Number(query.page) || 1);
    const limitNum = Math.max(1, Number(query.limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [data, total, totalAmountAgg] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.expense.count({ where }),
      this.prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalAmount: Number(totalAmountAgg._sum.amount || 0),
      },
    };
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!expense) throw new NotFoundException('Expense record not found');
    return { data: expense };
  }

  async create(dto: CreateExpenseDto, userId?: string) {
    const expense = await this.prisma.expense.create({
      data: {
        title: dto.title,
        category: dto.category,
        amount: dto.amount as any,
        date: dto.date ? new Date(dto.date) : new Date(),
        paymentMethod: dto.paymentMethod || 'Cash',
        notes: dto.notes,
        referenceNo: dto.referenceNo,
        createdById: userId,
      },
    });
    return { message: 'Expense logged successfully', data: expense };
  }

  async update(id: string, dto: UpdateExpenseDto) {
    const existing = await this.prisma.expense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Expense record not found');

    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.category && { category: dto.category }),
        ...(dto.amount !== undefined && { amount: dto.amount as any }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.referenceNo !== undefined && { referenceNo: dto.referenceNo }),
      },
    });

    return { message: 'Expense updated successfully', data: updated };
  }

  async remove(id: string) {
    const existing = await this.prisma.expense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Expense record not found');
    await this.prisma.expense.delete({ where: { id } });
    return { message: 'Expense deleted successfully' };
  }

  async getCategoryBreakdown(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const breakdown = await this.prisma.expense.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      data: breakdown.map((b) => ({
        category: b.category,
        total: Number(b._sum.amount || 0),
        count: b._count.id,
      })),
    };
  }
}
