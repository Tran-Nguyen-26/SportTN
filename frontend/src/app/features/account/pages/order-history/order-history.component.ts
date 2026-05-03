import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  signal,
  computed
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductCardResponse } from '../../../../core/models/home-response/home-response';

// ─── Models ────────────────────────────────────────────────────────────────────

export interface DeliveryAddress {
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
}

export interface OrderItem {
  id: string;
  product: ProductCardResponse;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING    = 'PENDING',
  CONFIRMED  = 'CONFIRMED',
  SHIPPED    = 'SHIPPED',
  DELIVERED  = 'DELIVERED',
  CANCELLED  = 'CANCELLED',
  RETURNED   = 'RETURNED'
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  discountAmount?: number;
  paymentMethod?: string;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  createdAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

// ─── Filter tab config ──────────────────────────────────────────────────────────

interface StatusTab {
  value: string;
  label: string;
  icon: string;
}

// ─── Timeline step config ───────────────────────────────────────────────────────

interface TimelineStep {
  label: string;
  icon: string;
  statuses: OrderStatus[];  // statuses considered "done" when at or past this step
}

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class OrderHistoryComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ── State ────────────────────────────────────────────────────────────────────

  isLoading = false;
  showDetails = false;
  selectedOrder = signal<Order | null>(null);

  allOrders: Order[] = [];
  activeFilter = 'ALL';

  pageSize = 5;
  pageIndex = 0;

  // ── Filter tabs ──────────────────────────────────────────────────────────────

  statusTabs: StatusTab[] = [
    { value: 'ALL',       label: 'Tất cả',        icon: 'list_alt' },
    { value: 'PENDING',   label: 'Chờ xử lý',     icon: 'schedule' },
    { value: 'CONFIRMED', label: 'Đã xác nhận',   icon: 'verified' },
    { value: 'SHIPPED',   label: 'Đang giao',      icon: 'local_shipping' },
    { value: 'DELIVERED', label: 'Đã giao',        icon: 'inventory_2' },
    { value: 'CANCELLED', label: 'Đã hủy',         icon: 'cancel' },
  ];

  // ── Timeline steps ───────────────────────────────────────────────────────────

  timelineSteps: TimelineStep[] = [
    {
      label: 'Đã đặt hàng',
      icon: 'shopping_cart',
      statuses: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
    },
    {
      label: 'Đã xác nhận',
      icon: 'verified',
      statuses: [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
    },
    {
      label: 'Đang vận chuyển',
      icon: 'local_shipping',
      statuses: [OrderStatus.SHIPPED, OrderStatus.DELIVERED]
    },
    {
      label: 'Đã nhận hàng',
      icon: 'inventory_2',
      statuses: [OrderStatus.DELIVERED]
    }
  ];

  // ── Status display config ─────────────────────────────────────────────────────

  private readonly statusConfig: Record<string, { label: string; icon: string; cssClass: string }> = {
    [OrderStatus.PENDING]:   { label: 'Chờ xử lý',   icon: 'schedule',       cssClass: 'pending'   },
    [OrderStatus.CONFIRMED]: { label: 'Đã xác nhận', icon: 'verified',        cssClass: 'confirmed' },
    [OrderStatus.SHIPPED]:   { label: 'Đang giao',   icon: 'local_shipping',  cssClass: 'shipped'   },
    [OrderStatus.DELIVERED]: { label: 'Đã giao',     icon: 'inventory_2',     cssClass: 'delivered' },
    [OrderStatus.CANCELLED]: { label: 'Đã hủy',      icon: 'cancel',          cssClass: 'cancelled' },
    [OrderStatus.RETURNED]:  { label: 'Đã hoàn trả', icon: 'assignment_return', cssClass: 'returned' },
  };

  // ── Computed getters ─────────────────────────────────────────────────────────

  get filteredOrders(): Order[] {
    if (this.activeFilter === 'ALL') return this.allOrders;
    return this.allOrders.filter(o => o.status === this.activeFilter);
  }

  get pagedOrders(): Order[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    return this.pageIndex * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredOrders.length);
  }

  get totalOrders(): number {
    return this.allOrders.length;
  }

  get deliveredCount(): number {
    return this.allOrders.filter(o => o.status === OrderStatus.DELIVERED).length;
  }

  get shippedCount(): number {
    return this.allOrders.filter(o => o.status === OrderStatus.SHIPPED).length;
  }

  get totalSpent(): number {
    return this.allOrders
      .filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.RETURNED)
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {}

  // ── Data loading (replace mock với service call) ──────────────────────────────

  loadOrders(): void {
    this.isLoading = true;

    // TODO: thay bằng this.orderService.getMyOrders().subscribe(...)
    setTimeout(() => {
      this.allOrders = this.getMockOrders();
      this.isLoading = false;
    }, 800);
  }

  // ── Filter ────────────────────────────────────────────────────────────────────

  setFilter(status: string): void {
    this.activeFilter = status;
    this.pageIndex = 0;
  }

  getCountByStatus(status: string): number {
    if (status === 'ALL') return this.allOrders.length;
    return this.allOrders.filter(o => o.status === status).length;
  }

  // ── Pagination ────────────────────────────────────────────────────────────────

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
  }

  // ── Modal ─────────────────────────────────────────────────────────────────────

  viewOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
    this.showDetails = true;
    document.body.style.overflow = 'hidden';
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedOrder.set(null);
    document.body.style.overflow = '';
  }

  // ── Status helpers ────────────────────────────────────────────────────────────

  getStatusLabel(status: string): string {
    return this.statusConfig[status]?.label ?? status;
  }

  getStatusIcon(status: string): string {
    return this.statusConfig[status]?.icon ?? 'info';
  }

  getStatusClass(status: string): string {
    return this.statusConfig[status]?.cssClass ?? '';
  }

  // ── Timeline helpers ──────────────────────────────────────────────────────────

  isStepDone(stepIndex: number, status: OrderStatus): boolean {
    if (status === OrderStatus.CANCELLED) return stepIndex === 0;
    return this.timelineSteps[stepIndex].statuses.includes(status) &&
      stepIndex < this.getActiveStepIndex(status);
  }

  isStepActive(stepIndex: number, status: OrderStatus): boolean {
    if (status === OrderStatus.CANCELLED) return false;
    return stepIndex === this.getActiveStepIndex(status);
  }

  getActiveStepIndex(status: OrderStatus): number {
    const map: Record<string, number> = {
      [OrderStatus.PENDING]:   0,
      [OrderStatus.CONFIRMED]: 1,
      [OrderStatus.SHIPPED]:   2,
      [OrderStatus.DELIVERED]: 3,
      [OrderStatus.CANCELLED]: 0,
      [OrderStatus.RETURNED]:  3,
    };
    return map[status] ?? 0;
  }

  getTimelineProgress(status: OrderStatus): string {
    const pct: Record<string, string> = {
      [OrderStatus.PENDING]:   '0%',
      [OrderStatus.CONFIRMED]: '33%',
      [OrderStatus.SHIPPED]:   '66%',
      [OrderStatus.DELIVERED]: '100%',
      [OrderStatus.CANCELLED]: '0%',
      [OrderStatus.RETURNED]:  '100%',
    };
    return pct[status] ?? '0%';
  }

  getStepTime(stepIndex: number, order: Order): string {
    const dates: (Date | undefined)[] = [
      order.createdAt,
      order.confirmedAt,
      order.shippedAt,
      order.deliveredAt
    ];
    const d = dates[stepIndex];
    if (!d) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(d));
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  downloadInvoice(): void {
    const order = this.selectedOrder();
    if (!order) return;
    // TODO: this.invoiceService.download(order.id)
    console.log('[OrderHistory] Xuất hóa đơn cho đơn hàng:', order.id);
  }

  reorder(order: Order): void {
    // TODO: thêm tất cả items vào cart
    console.log('[OrderHistory] Mua lại đơn hàng:', order.id);
  }

  cancelOrder(order: Order): void {
    // TODO: this.orderService.cancel(order.id).subscribe(...)
    console.log('[OrderHistory] Hủy đơn hàng:', order.id);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder-product.png';
  }

  // ── Mock data (xóa khi tích hợp API) ─────────────────────────────────────────

  private getMockOrders(): Order[] {
    return [
      {
        id: 'STN-2026-0001',
        status: OrderStatus.DELIVERED,
        createdAt: new Date('2026-04-10T10:00:00'),
        confirmedAt: new Date('2026-04-10T10:45:00'),
        shippedAt: new Date('2026-04-11T08:00:00'),
        deliveredAt: new Date('2026-04-12T14:30:00'),
        totalPrice: 3200000,
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        deliveryAddress: {
          name: 'Trần Thành Nguyên',
          phoneNumber: '0905 123 456',
          address: 'Đại học Bách Khoa, 268 Lý Thường Kiệt, P.14, Q.10',
          city: 'TP. Hồ Chí Minh'
        },
        items: [
          {
            id: 'ITM-001',
            product: {
              id: 101,
              name: 'Giày Tennis Adidas Barricade 13',
              slug: 'giay-tennis-adidas-barricade-13',
              mainImageUrl: 'assets/images/products/adidas-barricade.jpg',
              brandName: 'Adidas',
              effectivePrice: 3200000
            } as ProductCardResponse,
            quantity: 1,
            price: 3200000
          }
        ]
      },
      {
        id: 'STN-2026-0002',
        status: OrderStatus.SHIPPED,
        createdAt: new Date('2026-04-22T14:05:00'),
        confirmedAt: new Date('2026-04-22T15:00:00'),
        shippedAt: new Date('2026-04-23T09:00:00'),
        totalPrice: 2530000,
        paymentMethod: 'VNPay',
        deliveryAddress: {
          name: 'Trần Thành Nguyên',
          phoneNumber: '0905 123 456',
          address: 'Đại học Bách Khoa, 268 Lý Thường Kiệt, P.14, Q.10',
          city: 'TP. Hồ Chí Minh'
        },
        items: [
          {
            id: 'ITM-002',
            product: {
              id: 102,
              name: 'Áo Thể Thao Nike Dri-FIT Academy',
              slug: 'ao-nike-dri-fit-academy',
              mainImageUrl: 'assets/images/products/nike-dri-fit.jpg',
              brandName: 'Nike',
              effectivePrice: 890000
            } as ProductCardResponse,
            quantity: 2,
            price: 890000
          },
          {
            id: 'ITM-003',
            product: {
              id: 103,
              name: 'Quần Short Nike Flex Stride',
              slug: 'quan-nike-flex-stride',
              mainImageUrl: 'assets/images/products/nike-flex-stride.jpg',
              brandName: 'Nike',
              effectivePrice: 750000
            } as ProductCardResponse,
            quantity: 1,
            price: 750000
          }
        ]
      },
      {
        id: 'STN-2026-0003',
        status: OrderStatus.PENDING,
        createdAt: new Date('2026-04-30T11:18:00'),
        totalPrice: 5200000,
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        deliveryAddress: {
          name: 'Trần Thành Nguyên',
          phoneNumber: '0905 123 456',
          address: 'Đại học Bách Khoa, 268 Lý Thường Kiệt, P.14, Q.10',
          city: 'TP. Hồ Chí Minh'
        },
        items: [
          {
            id: 'ITM-004',
            product: {
              id: 104,
              name: 'Vợt Cầu Lông Yonex Astrox 88D Pro',
              slug: 'vot-yonex-astrox-88d-pro',
              mainImageUrl: 'assets/images/products/yonex-astrox.jpg',
              brandName: 'Yonex',
              effectivePrice: 5200000
            } as ProductCardResponse,
            quantity: 1,
            price: 5200000
          }
        ]
      },
      {
        id: 'STN-2026-0004',
        status: OrderStatus.CONFIRMED,
        createdAt: new Date('2026-04-28T09:00:00'),
        confirmedAt: new Date('2026-04-28T09:30:00'),
        totalPrice: 1480000,
        paymentMethod: 'MoMo',
        deliveryAddress: {
          name: 'Trần Thành Nguyên',
          phoneNumber: '0905 123 456',
          address: 'Đại học Bách Khoa, 268 Lý Thường Kiệt, P.14, Q.10',
          city: 'TP. Hồ Chí Minh'
        },
        items: [
          {
            id: 'ITM-005',
            product: {
              id: 105,
              name: 'Giày Chạy Bộ Asics Gel-Nimbus 26',
              slug: 'giay-asics-gel-nimbus-26',
              mainImageUrl: 'assets/images/products/asics-nimbus.jpg',
              brandName: 'Asics',
              effectivePrice: 1480000
            } as ProductCardResponse,
            quantity: 1,
            price: 1480000
          }
        ]
      },
      {
        id: 'STN-2026-0005',
        status: OrderStatus.CANCELLED,
        createdAt: new Date('2026-03-15T16:00:00'),
        totalPrice: 890000,
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        deliveryAddress: {
          name: 'Trần Thành Nguyên',
          phoneNumber: '0905 123 456',
          address: 'Đại học Bách Khoa, 268 Lý Thường Kiệt, P.14, Q.10',
          city: 'TP. Hồ Chí Minh'
        },
        items: [
          {
            id: 'ITM-006',
            product: {
              id: 106,
              name: 'Bóng Đá Kipsta F500 Sala',
              slug: 'bong-da-kipsta-f500-sala',
              mainImageUrl: 'assets/images/products/kipsta-f500.jpg',
              brandName: 'Decathlon',
              effectivePrice: 320000
            } as ProductCardResponse,
            quantity: 2,
            price: 320000
          }
        ]
      }
    ];
  }
}
