import { Component } from '@angular/core';

export type NotifType = 'order' | 'stock' | 'promo' | 'system' | 'review' | 'payment';

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  timeAgo: string;
  read: boolean;
  link?: string;
  actionLabel?: string;
  actionIcon?: string;
  meta?: { icon: string; text: string };
}

export interface ComposeForm {
  type: NotifType;
  title: string;
  body: string;
  link: string;
  audience: string;
  scheduled: boolean;
  scheduleDate: string;
  scheduleTime: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  searchQuery = '';
  selectedType = '';
  selectedNotif: Notification | null = null;
  composeMode = false;

  sentCount = 8;
  totalReach = 12480;

  typeTabs = [
    { value: '',        label: 'Tất cả',      icon: 'inbox'            },
    { value: 'order',   label: 'Đơn hàng',    icon: 'shopping_bag'     },
    { value: 'stock',   label: 'Tồn kho',     icon: 'inventory_2'      },
    { value: 'payment', label: 'Thanh toán',  icon: 'payments'         },
    { value: 'promo',   label: 'Khuyến mãi',  icon: 'local_offer'      },
    { value: 'review',  label: 'Đánh giá',    icon: 'star'             },
    { value: 'system',  label: 'Hệ thống',    icon: 'settings'         },
  ];

  composeTypes = [
    { value: 'promo',  label: 'Khuyến mãi', icon: 'local_offer'   },
    { value: 'order',  label: 'Đơn hàng',   icon: 'shopping_bag'  },
    { value: 'system', label: 'Hệ thống',   icon: 'campaign'      },
    { value: 'stock',  label: 'Sản phẩm',   icon: 'inventory_2'   },
  ] as { value: NotifType; label: string; icon: string }[];

  audienceOptions = [
    { value: 'all',     label: 'Tất cả khách hàng', icon: 'people',          count: '12.480 người' },
    { value: 'new',     label: 'Khách hàng mới',     icon: 'person_add',      count: '1.156 người'  },
    { value: 'vip',     label: 'Khách VIP',          icon: 'workspace_premium', count: '248 người'  },
    { value: 'inactive',label: 'Chưa mua 30 ngày',  icon: 'person_off',      count: '3.200 người'  },
  ];

  composeForm: ComposeForm = this.emptyCompose();

  notifications: Notification[] = [
    {
      id: 1, type: 'order', read: false,
      title: 'Đơn hàng mới #10284',
      body: 'Khách hàng Nguyễn Văn An vừa đặt đơn hàng trị giá 1.250.000đ · 3 sản phẩm',
      time: '18/07/2025 14:32',
      timeAgo: '5 phút trước',
      link: '/admin/orders/10284',
      actionLabel: 'Xem đơn hàng', actionIcon: 'visibility',
      meta: { icon: 'person', text: 'Nguyễn Văn An · 0987 654 321' },
    },
    {
      id: 2, type: 'stock', read: false,
      title: 'Sắp hết hàng: Kính Bơi TYR Special Ops',
      body: 'SKU GOG-TYR-SO chỉ còn 3 sản phẩm trong kho. Cần nhập thêm hàng sớm.',
      time: '18/07/2025 13:15',
      timeAgo: '1 giờ trước',
      link: '/admin/products/12',
      actionLabel: 'Cập nhật tồn kho', actionIcon: 'add_circle',
      meta: { icon: 'inventory_2', text: 'Còn 3 / 120 sản phẩm' },
    },
    {
      id: 3, type: 'payment', read: false,
      title: 'Thanh toán thất bại - Đơn #10281',
      body: 'Giao dịch VNPay của đơn hàng #10281 bị từ chối. Khách hàng Trần Thị Bích cần được hỗ trợ.',
      time: '18/07/2025 12:48',
      timeAgo: '2 giờ trước',
      link: '/admin/orders/10281',
      actionLabel: 'Liên hệ khách hàng', actionIcon: 'phone',
      meta: { icon: 'credit_card', text: 'VNPay · Mã lỗi: 09' },
    },
    {
      id: 4, type: 'order', read: true,
      title: 'Đơn hàng #10279 đã giao thành công',
      body: 'Đơn hàng của khách Lê Minh Khoa đã được giao thành công lúc 11:20.',
      time: '18/07/2025 11:25',
      timeAgo: '3 giờ trước',
      meta: { icon: 'local_shipping', text: 'Giao Hàng Nhanh · GHN123456789' },
    },
    {
      id: 5, type: 'review', read: false,
      title: 'Đánh giá mới cần duyệt',
      body: 'Phạm Thu Hà vừa đánh giá 2 sao cho "Áo Chạy Bộ Nike Dri-FIT". Cần kiểm duyệt trước khi hiển thị.',
      time: '18/07/2025 10:02',
      timeAgo: '4 giờ trước',
      link: '/admin/reviews',
      actionLabel: 'Duyệt đánh giá', actionIcon: 'rate_review',
      meta: { icon: 'star', text: '2/5 sao · Áo Chạy Bộ Nike Dri-FIT' },
    },
    {
      id: 6, type: 'promo', read: true,
      title: 'Flash Sale "Đồ Bơi Mùa Hè" đã kết thúc',
      body: 'Flash sale kết thúc lúc 20:00. Đã bán 156/200 sản phẩm. Doanh thu: 42.500.000đ.',
      time: '17/07/2025 20:01',
      timeAgo: 'Hôm qua',
      meta: { icon: 'bolt', text: '156 sản phẩm · 42.500.000đ doanh thu' },
    },
    {
      id: 7, type: 'system', read: true,
      title: 'Sao lưu dữ liệu thành công',
      body: 'Hệ thống đã sao lưu toàn bộ dữ liệu tự động lúc 03:00. Kích thước: 2.4GB.',
      time: '18/07/2025 03:00',
      timeAgo: 'Sáng nay',
      meta: { icon: 'backup', text: '2.4GB · Lưu trữ: Google Cloud' },
    },
    {
      id: 8, type: 'stock', read: true,
      title: 'Hết hàng: Mũ Bơi Speedo Fastskin Đỏ/M',
      body: 'SKU CAP-SPD-R-M đã hết hàng hoàn toàn. Cần nhập hàng ngay để tránh mất đơn.',
      time: '17/07/2025 16:30',
      timeAgo: 'Hôm qua',
      link: '/admin/products/8',
      actionLabel: 'Nhập kho', actionIcon: 'add_shopping_cart',
      meta: { icon: 'inventory_2', text: 'Còn 0 / 80 sản phẩm' },
    },
    {
      id: 9, type: 'payment', read: true,
      title: 'Hoàn tiền thành công - Đơn #10265',
      body: 'Hoàn tiền 850.000đ cho khách Hoàng Đức Thịnh do đổi trả hàng. Giao dịch đã được xử lý.',
      time: '17/07/2025 14:00',
      timeAgo: 'Hôm qua',
      meta: { icon: 'price_check', text: '850.000đ · MoMo' },
    },
    {
      id: 10, type: 'order', read: true,
      title: '5 đơn hàng chờ xác nhận',
      body: 'Có 5 đơn hàng mới đang chờ xác nhận trong hơn 2 giờ. Vui lòng xử lý sớm.',
      time: '17/07/2025 10:00',
      timeAgo: 'Hôm qua',
      link: '/admin/orders?status=pending',
      actionLabel: 'Xem đơn hàng', actionIcon: 'visibility',
      meta: { icon: 'hourglass_empty', text: '5 đơn · Chờ quá 2 giờ' },
    },
  ];

  // ── Computed ────────────────────────────────
  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getTypeCount(type: string): number {
    if (!type) return this.notifications.filter(n => !n.read).length;
    return this.notifications.filter(n => n.type === type && !n.read).length;
  }

  get filteredNotifications(): Notification[] {
    return this.notifications.filter(n => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
      const matchT = !this.selectedType || n.type === this.selectedType;
      return matchQ && matchT;
    });
  }

  // ── Type helpers ─────────────────────────────
  getTypeIcon(type: NotifType): string {
    const map: Record<NotifType, string> = {
      order:   'shopping_bag',
      stock:   'inventory_2',
      promo:   'local_offer',
      system:  'settings',
      review:  'star',
      payment: 'payments',
    };
    return map[type] ?? 'notifications';
  }

  getComposeTypeIcon(): string {
    return this.getTypeIcon(this.composeForm.type);
  }

  // ── Actions ──────────────────────────────────
  selectNotif(n: Notification): void {
    this.selectedNotif = n;
    this.composeMode   = false;
    if (!n.read) n.read = true;
  }

  toggleRead(n: Notification): void {
    n.read = !n.read;
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  deleteNotif(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    if (this.selectedNotif?.id === id) this.selectedNotif = null;
  }

  clearAll(): void {
    if (confirm('Xóa tất cả thông báo?')) {
      this.notifications = [];
      this.selectedNotif = null;
    }
  }

  // ── Compose ──────────────────────────────────
  openCompose(): void {
    this.composeMode   = true;
    this.selectedNotif = null;
    this.composeForm   = this.emptyCompose();
  }

  isComposeValid(): boolean {
    return !!(this.composeForm.title && this.composeForm.body);
  }

  sendNotification(): void {
    if (!this.isComposeValid()) return;
    // TODO: gọi API
    // Thêm vào danh sách local để demo
    this.notifications.unshift({
      id:      Date.now(),
      type:    this.composeForm.type,
      title:   `[Đã gửi] ${this.composeForm.title}`,
      body:    this.composeForm.body,
      time:    new Date().toLocaleString('vi-VN'),
      timeAgo: 'Vừa xong',
      read:    true,
      link:    this.composeForm.link || undefined,
      meta:    {
        icon: 'people',
        text: `Đã gửi đến: ${this.getAudienceLabel(this.composeForm.audience)}`,
      },
    });
    this.sentCount++;
    this.composeMode = false;
    this.composeForm = this.emptyCompose();
  }

  private getAudienceLabel(v: string): string {
    return this.audienceOptions.find(a => a.value === v)?.label ?? v;
  }

  private emptyCompose(): ComposeForm {
    return {
      type:         'promo',
      title:        '',
      body:         '',
      link:         '',
      audience:     'all',
      scheduled:    false,
      scheduleDate: '',
      scheduleTime: '',
    };
  }
}
