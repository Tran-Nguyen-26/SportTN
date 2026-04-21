import { Component, signal, computed } from '@angular/core';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  createdAt: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  // Signal quản lý danh sách thông báo mẫu
  notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Đơn hàng đã được xác nhận',
      message: 'Đơn hàng #STN123 của bạn đã được hệ thống xác nhận và đang chờ đóng gói.',
      type: 'order',
      createdAt: new Date(),
      isRead: false
    },
    {
      id: 2,
      title: 'Ưu đãi cực HOT cuối tuần',
      message: 'Nhập mã SPORTTN để được giảm ngay 20% cho các dòng giày chạy bộ.',
      type: 'promo',
      createdAt: new Date(Date.now() - 3600000 * 2),
      isRead: true
    },
    {
      id: 3,
      title: 'Bảo trì hệ thống định kỳ',
      message: 'Hệ thống sẽ bảo trì từ 00:00 đến 02:00 ngày mai để nâng cấp hiệu năng.',
      type: 'system',
      createdAt: new Date(Date.now() - 86400000),
      isRead: false
    }
  ]);

  getIcon(type: string): string {
    switch (type) {
      case 'order': return 'local_shipping';
      case 'promo': return 'sell';
      case 'system': return 'settings_suggest';
      default: return 'notifications';
    }
  }

  markAsRead(id: number) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  deleteNotification(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );
}
