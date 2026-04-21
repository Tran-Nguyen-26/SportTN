import { Component } from '@angular/core';

export interface Order {
  id: string;
  customer: string;
  avatar: string;
  product: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  searchQuery = '';
  selectedStatus = '';

  statusOptions = [
    { value: '',           label: 'Tất cả trạng thái' },
    { value: 'PENDING',    label: 'Chờ xử lý' },
    { value: 'CONFIRMED',  label: 'Đã xác nhận' },
    { value: 'SHIPPING',   label: 'Đang giao' },
    { value: 'DELIVERED',  label: 'Đã giao' },
    { value: 'CANCELLED',  label: 'Đã hủy' },
  ];

  orders: Order[] = [
    { id: '#DH001', customer: 'Nguyễn Văn A', avatar: 'NA', product: 'Giày Nike Air Zoom', date: '21/04/2025', amount: 1200000, status: 'DELIVERED',  paymentMethod: 'VNPay' },
    { id: '#DH002', customer: 'Trần Thị B',   avatar: 'TB', product: 'Áo Decathlon Run Dry', date: '21/04/2025', amount: 450000,  status: 'SHIPPING',   paymentMethod: 'COD'   },
    { id: '#DH003', customer: 'Lê Văn C',     avatar: 'LC', product: 'Kính bơi Nabaiji',    date: '20/04/2025', amount: 299000,  status: 'PENDING',    paymentMethod: 'Momo'  },
    { id: '#DH004', customer: 'Phạm Thị D',   avatar: 'PD', product: 'Tất chạy bộ x3',      date: '20/04/2025', amount: 79000,   status: 'CONFIRMED',  paymentMethod: 'VNPay' },
    { id: '#DH005', customer: 'Hoàng Văn E',  avatar: 'HE', product: 'Mũ lưỡi trai Travel', date: '19/04/2025', amount: 59000,   status: 'CANCELLED',  paymentMethod: 'COD'   },
    { id: '#DH006', customer: 'Vũ Thị F',     avatar: 'VF', product: 'Balo chạy bộ Trail',  date: '19/04/2025', amount: 890000,  status: 'DELIVERED',  paymentMethod: 'Momo'  },
    { id: '#DH007', customer: 'Đặng Văn G',   avatar: 'DG', product: 'Kính mát hiking',     date: '18/04/2025', amount: 129000,  status: 'SHIPPING',   paymentMethod: 'VNPay' },
    { id: '#DH008', customer: 'Bùi Thị H',    avatar: 'BH', product: 'Áo hoodie chống nắng',date: '18/04/2025', amount: 399000,  status: 'PENDING',    paymentMethod: 'COD'   },
  ];

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      const matchStatus  = !this.selectedStatus || o.status === this.selectedStatus;
      const matchSearch  = !this.searchQuery
        || o.customer.toLowerCase().includes(this.searchQuery.toLowerCase())
        || o.id.toLowerCase().includes(this.searchQuery.toLowerCase())
        || o.product.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}
