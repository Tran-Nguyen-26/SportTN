import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import {
  OrderService,
  OrderResponse,
  OrderStatus,
  OrderFilterParams,
  UpdateOrderStatusRequest,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  OrderStatsResponse
} from "../../../core/services/order/order.service";

interface StatusTab {
  value: string;
  label: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {

  // ── State ─────────────────────────────────────────────────────────────────
  isLoading      = false;
  orders: OrderResponse[] = [];
  totalElements  = 0;
  totalPages     = 0;
  pageIndex      = 0;
  pageSize       = 20;

  searchKeyword  = '';
  selectedStatus = '';
  selectedOrder: OrderResponse | null = null;
  modalMode: 'view' | 'edit' = 'view';

  private searchSubject = new Subject<string>();

  // ── Filter options ────────────────────────────────────────────────────────
  statusOptions: StatusTab[] = [
    { value: '',          label: 'Tất cả trạng thái' },
    { value: 'PENDING',   label: 'Chờ xử lý'         },
    { value: 'CONFIRMED', label: 'Đã xác nhận'       },
    { value: 'SHIPPING',  label: 'Đang giao'          },
    { value: 'DELIVERED', label: 'Đã giao'            },
    { value: 'CANCELLED', label: 'Đã hủy'             },
  ];

  stats: OrderStatsResponse = {
    pending:   0,
    confirmed: 0,
    shipping:  0,
    delivered: 0,
    cancelled: 0
  };

  constructor(private orderService: OrderService) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadOrders();
    this.loadStats();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.searchKeyword = keyword;
      this.pageIndex     = 0;
      this.loadOrders();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadOrders(): void {
    this.isLoading = true;

    const params: OrderFilterParams = {
      page:    this.pageIndex,
      size:    this.pageSize,
      status:  this.selectedStatus as OrderStatus | '',
      keyword: this.searchKeyword || undefined
    };

    this.orderService.adminGetOrders(params).subscribe({
      next: (res) => {
        if (res.data) {
          this.orders        = res.data.content;
          this.totalElements = res.data.totalElements;
          this.totalPages    = res.data.totalPages;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ADMIN-ORDER] Lỗi tải đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }

  loadStats(): void {
    this.orderService.adminGetOrderStats().subscribe({
      next: (res) => { if (res.data) this.stats = res.data; },
      error: (err) => console.error('[ADMIN-ORDER] Lỗi tải thống kê:', err)
    });
  }

  // ── Search & Filter ───────────────────────────────────────────────────────
  onSearchInput(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadOrders();
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadOrders();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
      this.loadOrders();
    }
  }

  goToPreviousPage(): void {
    this.goToPage(this.pageIndex - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.pageIndex + 1);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  openView(order: OrderResponse): void {
    this.selectedOrder = order;
    this.modalMode     = 'view';

    this.orderService.adminGetOrderById(order.id).subscribe({
      next: (res) => { if (res.data) this.selectedOrder = res.data; },
      error: (err) => console.error('[ADMIN-ORDER] Lỗi tải chi tiết:', err)
    });
  }

  openEdit(order: OrderResponse): void {
    this.selectedOrder = { ...order };
    this.modalMode     = 'edit';
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // ── Update Status ─────────────────────────────────────────────────────────
  updateStatus(orderId: number, status: OrderStatus): void {
    const payload: UpdateOrderStatusRequest = { status };
    this.orderService.adminUpdateStatus(orderId, payload).subscribe({
      next: () => {
        this.loadOrders();
        this.loadStats();
        this.closeModal();
      },
      error: (err) => console.error('[ADMIN-ORDER] Lỗi cập nhật trạng thái:', err)
    });
  }

  // ── Cancel ────────────────────────────────────────────────────────────────
  cancelOrder(orderId: number, reason?: string): void {
    this.orderService.adminCancelOrder(orderId, reason).subscribe({
      next: () => {
        this.loadOrders();
        this.loadStats();
        this.closeModal();
      },
      error: (err) => console.error('[ADMIN-ORDER] Lỗi hủy đơn:', err)
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  getStatusLabel(status: string): string {
    return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
  }

  getPaymentMethodLabel(method: string): string {
    return PAYMENT_METHOD_LABEL[method as keyof typeof PAYMENT_METHOD_LABEL] ?? method;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}
