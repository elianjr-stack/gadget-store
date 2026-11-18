import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(userId: string, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;
    const notifications = await this.prisma.notification.findMany({
      where, orderBy: { createdAt: 'desc' }, take: 50,
    });
    return { data: notifications };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    return { message: 'All notifications marked as read' };
  }

  async subscribeStockAlert(userId: string, productId: string) {
    const existing = await this.prisma.stockAlert.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) return { message: 'Already subscribed' };
    await this.prisma.stockAlert.create({ data: { userId, productId } });
    return { message: 'Stock alert subscribed' };
  }

  async unsubscribeStockAlert(userId: string, productId: string) {
    await this.prisma.stockAlert.deleteMany({ where: { userId, productId } });
    return { message: 'Stock alert removed' };
  }

  async createNotification(userId: string, type: string, title: string, message: string, data?: any) {
    const notif = await this.prisma.notification.create({
      data: { userId, type: type as any, title, message, data },
    });
    return notif;
  }
}
