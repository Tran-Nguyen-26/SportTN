import { Component, signal, computed } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

export type NotifType = 'order' | 'promo' | 'system';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotifType;
  createdAt: Date;
  isRead: boolean;
  pinned?: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  openMenuId: number | null = null;

  toastMsg     = '';
  toastVisible = false;
  private toastTimer: any;

  notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Đơn hàng #STN123 đã được xác nhận',
      message: 'Đơn hàng của bạn đã được hệ thống xác nhận và đang chờ đóng gói.',
      type: 'order',
      createdAt: new Date(),
      isRead: false
    },
    {
      id: 2,
      title: 'Ưu đãi cực HOT cuối tuần',
      message: 'Nhập mã SPORTTN để được giảm ngay 20% cho các dòng giày chạy bộ.',
      type: 'promo',
      createdAt: new Date(Date.now() - 3_600_000 * 2),
      isRead: true
    },
    {
      id: 3,
      title: 'Bảo trì hệ thống định kỳ',
      message: 'Hệ thống sẽ bảo trì từ 00:00 đến 02:00 ngày mai để nâng cấp hiệu năng.',
      type: 'system',
      createdAt: new Date(Date.now() - 86_400_000),
      isRead: false
    }
  ]);

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.isRead).length
  );

  constructor(private clipboard: Clipboard) {}

  // ── Icon map ──────────────────────────────────
  getIcon(type: NotifType): string {
    const map: Record<NotifType, string> = {
      order:  'local_shipping',
      promo:  'sell',
      system: 'settings_suggest',
    };
    return map[type];
  }

  // ── Card click: mark as read ──────────────────
  onCardClick(n: Notification): void {
    if (!n.isRead) this.markAsRead(n.id);
  }

  // ── Menu actions ──────────────────────────────
  markAsRead(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    this.showToast('Đã đánh dấu đã đọc');
  }

  markAsUnread(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
    this.showToast('Đã đánh dấu chưa đọc');
  }

  markAllAsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    this.showToast('Đã đánh dấu tất cả đã đọc');
  }

  copyContent(n: Notification): void {
    this.clipboard.copy(`${n.title}\n${n.message}`);
    this.showToast('Đã sao chép nội dung');
  }

  pinNotification(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    );
    this.showToast('Đã ghim thông báo');
  }

  deleteNotification(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
    this.showToast('Đã xóa thông báo');
  }

  // ── Toast helper ──────────────────────────────
  private showToast(msg: string): void {
    this.toastMsg     = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible = false, 2200);
  }
}
