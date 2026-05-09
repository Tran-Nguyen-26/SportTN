import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  OrderResponse,
  OrderStatus,
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL
} from "../../../core/services/order/order.service";

export interface TimelineEvent {
  label: string;
  done: boolean;
  active: boolean;
}

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent implements OnInit {

  @Input() order: OrderResponse | null = null;
  @Input() mode: 'view' | 'edit' = 'view';

  @Output() closed         = new EventEmitter<void>();
  @Output() statusUpdated  = new EventEmitter<{ id: number; status: OrderStatus }>();
  @Output() cancelled      = new EventEmitter<{ id: number; reason?: string }>();

  selectedStatus: OrderStatus | '' = '';
  cancelReason = '';
  showCancelConfirm = false;
  isSaving = false;

  statusOptions = [
    { value: 'PENDING',   label: 'Chờ xử lý'   },
    { value: 'CONFIRMED', label: 'Đã xác nhận'  },
    { value: 'SHIPPING',  label: 'Đang giao'    },
    { value: 'DELIVERED', label: 'Đã giao'      },
    { value: 'CANCELLED', label: 'Đã hủy'       },
  ];

  private readonly EDITABLE_STATUSES: OrderStatus[] = [
    'PENDING', 'CONFIRMED', 'SHIPPING'
  ];

  ngOnInit(): void {
    if (this.order) {
      this.selectedStatus = this.order.status;
    }
  }

  get isEditMode(): boolean { return this.mode === 'edit'; }

  get canEdit(): boolean {
    return this.EDITABLE_STATUSES.includes(this.order?.status as OrderStatus);
  }

  get timeline(): TimelineEvent[] {
    const steps: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
    const currentIdx = steps.indexOf(this.order?.status as OrderStatus);
    return [
      { label: 'Đơn đã được đặt',        done: currentIdx > 0,  active: currentIdx === 0 },
      { label: 'Đã xác nhận & đóng gói', done: currentIdx > 1,  active: currentIdx === 1 },
      { label: 'Đang vận chuyển',         done: currentIdx > 2,  active: currentIdx === 2 },
      { label: 'Giao hàng thành công',    done: currentIdx >= 3, active: currentIdx === 3 },
    ];
  }

  getStatusLabel(status: string): string {
    return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING:   'pending',
      CONFIRMED: 'confirmed',
      SHIPPING:  'shipping',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
      REFUNDED:  'refunded',
    };
    return map[status] ?? '';
  }

  getPaymentMethodLabel(method: string): string {
    return PAYMENT_METHOD_LABEL[method as keyof typeof PAYMENT_METHOD_LABEL] ?? method;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  switchToEdit(): void {
    this.mode = 'edit';
  }

  onSave(): void {
    if (!this.order || !this.selectedStatus) return;
    this.isSaving = true;
    this.statusUpdated.emit({
      id: this.order.id,
      status: this.selectedStatus as OrderStatus
    });
    this.isSaving = false;
  }

  onCancelOrder(): void {
    this.showCancelConfirm = true;
  }

  confirmCancel(): void {
    if (!this.order) return;
    this.cancelled.emit({
      id: this.order.id,
      reason: this.cancelReason || undefined
    });
    this.close();
  }

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
