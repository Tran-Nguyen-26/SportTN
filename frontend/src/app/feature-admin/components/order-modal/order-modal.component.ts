import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Order} from "../../pages/orders/orders.component";

export interface TimelineEvent {
  label: string;
  time: string;
  done: boolean;
  active: boolean;
}

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent implements OnInit {
  @Input() order: Order | null = null;
  @Input() mode: 'view' | 'edit' = 'view';
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Order>();
  @Output() cancelled = new EventEmitter<string>();

  editOrder: Order | null = null;
  isSaving = false;
  showCancelConfirm = false;

  statusOptions = [
    { value: 'PENDING',   label: 'Chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING',  label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  paymentOptions = ['VNPay', 'Momo', 'COD', 'Chuyển khoản'];

  paymentStatusOptions = [
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PAID',   label: 'Đã thanh toán' },
  ];

  internalNote = '';
  paymentStatus = 'UNPAID';
  address = '';
  quantity = 1;

  ngOnInit(): void {
    if (this.order) {
      this.editOrder = { ...this.order };
      this.address = this.getAddressMock(this.order.id);
      this.quantity = 1;
      this.paymentStatus = this.order.status === 'DELIVERED' ? 'PAID' : 'UNPAID';
    }
  }

  get isEditMode(): boolean { return this.mode === 'edit'; }

  get canEdit(): boolean {
    return this.order?.status === 'PENDING' || this.order?.status === 'CONFIRMED';
  }

  get timeline(): TimelineEvent[] {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
    const currentIdx = steps.indexOf(this.order?.status ?? '');
    return [
      { label: 'Đơn đã được đặt',       time: this.order?.date + ' · 09:12', done: currentIdx >= 0, active: currentIdx === 0 },
      { label: 'Đã xác nhận & đóng gói', time: this.order?.date + ' · 10:45', done: currentIdx >= 1, active: currentIdx === 1 },
      { label: 'Đang vận chuyển',         time: this.order?.date + ' · 08:30', done: currentIdx >= 2, active: currentIdx === 2 },
      { label: 'Giao hàng thành công',    time: this.order?.date + ' · 14:20', done: currentIdx >= 3, active: currentIdx === 3 },
    ];
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(s => s.value === status)?.label ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'pending', CONFIRMED: 'confirmed',
      SHIPPING: 'shipping', DELIVERED: 'delivered', CANCELLED: 'cancelled'
    };
    return map[status] ?? '';
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  adjustQty(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
    if (this.editOrder) {
      this.editOrder.amount = (this.order!.amount / 1) * this.quantity;
    }
  }

  onSave(): void {
    if (!this.editOrder) return;
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.saved.emit({ ...this.editOrder! });
      this.close();
    }, 600);
  }

  onCancelOrder(): void {
    this.showCancelConfirm = true;
  }

  confirmCancel(): void {
    if (this.order) {
      this.cancelled.emit(this.order.id);
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  switchToEdit(): void {
    this.mode = 'edit';
  }

  private getAddressMock(id: string): string {
    const map: Record<string, string> = {
      '#DH001': '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      '#DH002': '45 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      '#DH003': '78 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
      '#DH004': '12 Trần Phú, Hải Châu, Đà Nẵng',
    };
    return map[id] ?? '456 Hai Bà Trưng, Hà Nội';
  }
}
