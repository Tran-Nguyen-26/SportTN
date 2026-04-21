import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  get config(): { label: string; cssClass: string } {
    const map: Record<string, { label: string; cssClass: string }> = {
      // Order status
      'PENDING':    { label: 'Chờ xử lý',  cssClass: 'badge-warning'  },
      'CONFIRMED':  { label: 'Đã xác nhận', cssClass: 'badge-info'    },
      'SHIPPING':   { label: 'Đang giao',   cssClass: 'badge-blue'     },
      'DELIVERED':  { label: 'Đã giao',     cssClass: 'badge-success'  },
      'CANCELLED':  { label: 'Đã hủy',      cssClass: 'badge-danger'   },
      // Product status
      'ACTIVE':     { label: 'Đang bán',    cssClass: 'badge-success'  },
      'INACTIVE':   { label: 'Ngừng bán',   cssClass: 'badge-danger'   },
      'OUT_STOCK':  { label: 'Hết hàng',    cssClass: 'badge-warning'  },
    };
    return map[this.status] || { label: this.status, cssClass: 'badge-default' };
  }
}
