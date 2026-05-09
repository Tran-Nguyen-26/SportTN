import {
  Component,
  OnInit,
  signal
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  OrderService,
  OrderResponse,
  OrderStatus,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  PAYMENT_METHOD_LABEL,
  OrderFilterParams
} from '../../../../core/services/order/order.service';

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
  statuses: OrderStatus[];
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
export class OrderHistoryComponent implements OnInit {

  // ── State ────────────────────────────────────────────────────────────────────

  isLoading = false;
  showDetails = false;
  selectedOrder = signal<OrderResponse | null>(null);

  allOrders: OrderResponse[] = [];
  activeFilter = 'ALL';

  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  // ── Filter tabs ──────────────────────────────────────────────────────────────

  statusTabs: StatusTab[] = [
    { value: 'ALL',       label: 'Tất cả',       icon: 'list_alt'       },
    { value: 'PENDING',   label: 'Chờ xử lý',    icon: 'schedule'       },
    { value: 'CONFIRMED', label: 'Đã xác nhận',  icon: 'verified'       },
    { value: 'SHIPPING',  label: 'Đang giao',     icon: 'local_shipping' },
    { value: 'DELIVERED', label: 'Đã giao',       icon: 'inventory_2'   },
    { value: 'CANCELLED', label: 'Đã hủy',        icon: 'cancel'        },
  ];

  // ── Timeline steps ───────────────────────────────────────────────────────────

  timelineSteps: TimelineStep[] = [
    {
      label: 'Đã đặt hàng',
      icon: 'shopping_cart',
      statuses: ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'] as OrderStatus[]
    },
    {
      label: 'Đã xác nhận',
      icon: 'verified',
      statuses: ['CONFIRMED', 'SHIPPING', 'DELIVERED'] as OrderStatus[]
    },
    {
      label: 'Đang vận chuyển',
      icon: 'local_shipping',
      statuses: ['SHIPPING', 'DELIVERED'] as OrderStatus[]
    },
    {
      label: 'Đã nhận hàng',
      icon: 'inventory_2',
      statuses: ['DELIVERED'] as OrderStatus[]
    }
  ];

  // ── Status display config ─────────────────────────────────────────────────────

  private readonly statusConfig: Record<string, { label: string; icon: string; cssClass: string }> = {
    PENDING:    { label: 'Chờ xử lý',   icon: 'schedule',          cssClass: 'pending'   },
    CONFIRMED:  { label: 'Đã xác nhận', icon: 'verified',          cssClass: 'confirmed' },
    PROCESSING: { label: 'Đang xử lý',  icon: 'autorenew',         cssClass: 'processing'},
    SHIPPING:   { label: 'Đang giao',   icon: 'local_shipping',    cssClass: 'shipped'   },
    DELIVERED:  { label: 'Đã giao',     icon: 'inventory_2',       cssClass: 'delivered' },
    CANCELLED:  { label: 'Đã hủy',      icon: 'cancel',            cssClass: 'cancelled' },
    REFUNDED:   { label: 'Đã hoàn tiền',icon: 'assignment_return', cssClass: 'returned'  },
  };

  constructor(private orderService: OrderService) {}

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadOrders();
  }

  // ── Data loading ──────────────────────────────────────────────────────────────

  loadOrders(): void {
    this.isLoading = true;

    const params: OrderFilterParams = {
      page: this.pageIndex,
      size: this.pageSize,
      status: this.activeFilter === 'ALL' ? '' : this.activeFilter as OrderStatus
    };

    this.orderService.getMyOrders(params).subscribe({
      next: (res) => {
        if (res.data) {
          this.allOrders    = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ORDER-HISTORY] Lỗi tải đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }


  // ── Filter ────────────────────────────────────────────────────────────────────

  setFilter(status: string): void {
    this.activeFilter = status;
    this.pageIndex    = 0;
    this.loadOrders();
  }

  getCountByStatus(status: string): number {
    if (status === 'ALL') return this.totalElements;
    return this.allOrders.filter(o => o.status === status).length;
  }

  // ── Pagination ────────────────────────────────────────────────────────────────

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadOrders();
  }

  get pageStart(): number {
    return this.pageIndex * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalElements);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────────

  get totalOrders(): number {
    return this.totalElements;
  }

  get deliveredCount(): number {
    return this.allOrders.filter(o => o.status === 'DELIVERED').length;
  }

  get totalSpent(): number {
    return this.allOrders
      .filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
      .reduce((sum, o) => sum + o.finalAmount, 0);
  }

  // ── Modal ─────────────────────────────────────────────────────────────────────

  viewOrderDetails(order: OrderResponse): void {
    this.showDetails = true;
    this.selectedOrder.set(order); // hiện modal ngay với data có sẵn
    document.body.style.overflow = 'hidden';

    this.orderService.getOrderById(order.id).subscribe({
      next: (res) => {
        if (res.data) this.selectedOrder.set(res.data);
      },
      error: (err) => console.error('[ORDER-HISTORY] Lỗi tải chi tiết:', err)
    });
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

  getPaymentMethodLabel(method: string): string {
    return PAYMENT_METHOD_LABEL[method as keyof typeof PAYMENT_METHOD_LABEL] ?? method;
  }

  get shippedCount(): number {
    return this.allOrders.filter(o => o.status === 'SHIPPING').length;
  }

  // ── Timeline helpers ──────────────────────────────────────────────────────────

  isStepDone(stepIndex: number, status: OrderStatus): boolean {
    if (status === 'CANCELLED') return false;
    return stepIndex < this.getActiveStepIndex(status);
  }

  isStepActive(stepIndex: number, status: OrderStatus): boolean {
    if (status === 'CANCELLED') return false;
    return stepIndex === this.getActiveStepIndex(status);
  }

  getStepTime(stepIndex: number, order: OrderResponse): string {
    // BE hiện chưa trả về timestamp từng bước
    // Chỉ hiển thị createdAt cho bước đầu
    if (stepIndex === 0) {
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(new Date(order.createdAt));
    }
    return '';
  }

  getActiveStepIndex(status: OrderStatus): number {
    const map: Record<string, number> = {
      PENDING:   0,
      CONFIRMED: 1,
      SHIPPING:  2,
      DELIVERED: 3,
      CANCELLED: 0,
      REFUNDED:  3,
    };
    return map[status] ?? 0;
  }

  getTimelineProgress(status: OrderStatus): string {
    const pct: Record<string, string> = {
      PENDING:   '0%',
      CONFIRMED: '33%',
      SHIPPING:  '66%',
      DELIVERED: '100%',
      CANCELLED: '0%',
      REFUNDED:  '100%',
    };
    return pct[status] ?? '0%';
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  cancelOrder(order: OrderResponse): void {
    // TODO: this.orderService.cancelOrder(order.id).subscribe(...)
    console.log('[ORDER-HISTORY] Hủy đơn hàng:', order.id);
  }

  reorder(order: OrderResponse): void {
    // TODO: thêm tất cả items vào cart
    console.log('[ORDER-HISTORY] Mua lại đơn hàng:', order.id);
  }

  downloadInvoice(): void {
    const order = this.selectedOrder();
    if (!order) return;
    console.log('[ORDER-HISTORY] Xuất hóa đơn:', order.id);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // img.src = 'assets/images/placeholder-product.png';
  }
}
