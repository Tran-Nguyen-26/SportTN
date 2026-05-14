import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() type: 'order' | 'product' | 'customer' = 'product';

  get config(): { label: string; cssClass: string } {

    const orderMap: Record<string, any> = {
      'PENDING':   { label: 'Chờ xử lý',  cssClass: 'badge-warning' },
      'CONFIRMED': { label: 'Đã xác nhận', cssClass: 'badge-info' },
      'SHIPPING':  { label: 'Đang giao',  cssClass: 'badge-blue' },
      'DELIVERED': { label: 'Đã giao',    cssClass: 'badge-success' },
      'CANCELLED': { label: 'Đã hủy',     cssClass: 'badge-danger' },
    };

    const productMap: Record<string, any> = {
      'ACTIVE':    { label: 'Đang bán',  cssClass: 'badge-success' },
      'INACTIVE':  { label: 'Ngừng bán', cssClass: 'badge-danger' },
      'OUT_STOCK': { label: 'Hết hàng',  cssClass: 'badge-warning' },
    };

    const customerMap: Record<string, any> = {
      'ACTIVE':   { label: 'Hoạt động',   cssClass: 'badge-success' },
      'INACTIVE': { label: 'Vô hiệu hóa', cssClass: 'badge-danger' },
  };

    const mapByType = {
      order: orderMap,
      product: productMap,
      customer: customerMap
    };

    return mapByType[this.type][this.status]
      || { label: this.status, cssClass: 'badge-default' };
  }
}
