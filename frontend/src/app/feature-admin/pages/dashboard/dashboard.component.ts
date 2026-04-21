import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  today: string = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  selectedPeriod: string = 'today';

  periods = [
    { value: 'today',  label: 'Hôm nay' },
    { value: 'week',   label: '7 ngày' },
    { value: 'month',  label: '30 ngày' },
  ];

  get periodLabel(): string {
    const map: Record<string, string> = {
      today: 'hôm qua', week: 'tuần', month: 'tháng'
    };
    return map[this.selectedPeriod];
  }

  stats = [
    {
      icon: 'payments',
      color: 'blue',
      value: '48.250.000đ',
      label: 'Doanh thu hôm nay',
      trend: 12.5
    },
    {
      icon: 'shopping_bag',
      color: 'green',
      value: '136',
      label: 'Đơn hàng mới',
      trend: 8.3
    },
    {
      icon: 'people',
      color: 'orange',
      value: '24',
      label: 'Khách hàng mới',
      trend: -3.1
    },
    {
      icon: 'inventory_2',
      color: 'purple',
      value: '1.248',
      label: 'Sản phẩm đang bán',
      trend: 2.0
    },
  ];

  revenueData = [
    { day: 'T2', revenue: 32000000, revenuePercent: 52, orders: 98,  orderPercent: 40 },
    { day: 'T3', revenue: 41000000, revenuePercent: 66, orders: 120, orderPercent: 49 },
    { day: 'T4', revenue: 28000000, revenuePercent: 45, orders: 85,  orderPercent: 35 },
    { day: 'T5', revenue: 55000000, revenuePercent: 89, orders: 162, orderPercent: 66 },
    { day: 'T6', revenue: 62000000, revenuePercent: 100, orders: 245, orderPercent: 100 },
    { day: 'T7', revenue: 48000000, revenuePercent: 77, orders: 136, orderPercent: 56 },
    { day: 'CN', revenue: 38000000, revenuePercent: 61, orders: 110, orderPercent: 45 },
  ];

  yLabels = ['60tr', '45tr', '30tr', '15tr', '0'];

  orderStatuses = [
    { label: 'Chờ xác nhận', count: 28,  percent: 20,  color: 'yellow' },
    { label: 'Đang xử lý',   count: 45,  percent: 33,  color: 'blue'   },
    { label: 'Đang giao',    count: 52,  percent: 38,  color: 'orange' },
    { label: 'Hoàn thành',   count: 312, percent: 100, color: 'green'  },
    { label: 'Đã hủy',       count: 12,  percent: 9,   color: 'red'    },
  ];

  recentOrders = [
    { id: '10234', name: 'Nguyễn Văn An',    avatarColor: '#dbeafe', items: 2, total: 850000,  status: 'Hoàn thành',     statusClass: 'badge-green'  },
    { id: '10233', name: 'Trần Thị Bích',    avatarColor: '#fce7f3', items: 1, total: 320000,  status: 'Đang giao',      statusClass: 'badge-orange' },
    { id: '10232', name: 'Lê Minh Khoa',     avatarColor: '#d1fae5', items: 3, total: 1250000, status: 'Đang xử lý',     statusClass: 'badge-blue'   },
    { id: '10231', name: 'Phạm Thu Hà',      avatarColor: '#fef3c7', items: 1, total: 495000,  status: 'Chờ xác nhận',   statusClass: 'badge-yellow' },
    { id: '10230', name: 'Hoàng Đức Thịnh',  avatarColor: '#ede9fe', items: 4, total: 2100000, status: 'Hoàn thành',     statusClass: 'badge-green'  },
    { id: '10229', name: 'Vũ Thị Lan',       avatarColor: '#fee2e2', items: 1, total: 180000,  status: 'Đã hủy',         statusClass: 'badge-red'    },
    { id: '10228', name: 'Đặng Quốc Huy',    avatarColor: '#dbeafe', items: 2, total: 740000,  status: 'Đang giao',      statusClass: 'badge-orange' },
    { id: '10227', name: 'Bùi Thanh Tùng',   avatarColor: '#d1fae5', items: 1, total: 299000,  status: 'Hoàn thành',     statusClass: 'badge-green'  },
    { id: '10226', name: 'Ngô Thị Phương',   avatarColor: '#fce7f3', items: 2, total: 590000,  status: 'Đang xử lý',     statusClass: 'badge-blue'   },
    { id: '10225', name: 'Trịnh Văn Long',   avatarColor: '#fef3c7', items: 3, total: 915000,  status: 'Chờ xác nhận',   statusClass: 'badge-yellow' },
  ];

  topProducts = [
    { name: 'Áo Chạy Bộ Nike Dri-FIT',    category: 'Chạy bộ',  sold: 284, revenue: 85200000 },
    { name: 'Giày Bơi Speedo Aqua',        category: 'Bơi lội',  sold: 196, revenue: 58800000 },
    { name: 'Kính Bơi TYR Special Ops',    category: 'Bơi lội',  sold: 175, revenue: 43750000 },
    { name: 'Áo Chống Nắng UPF50+',        category: 'Chống nắng', sold: 163, revenue: 40750000 },
    { name: 'Giày Chạy Bộ Adidas Ultra',   category: 'Chạy bộ',  sold: 142, revenue: 99400000 },
  ];

  lowStockItems = [
    { name: 'Mũ Bơi Speedo - Đỏ / M',        sku: 'CAP-SPD-R-M',   stock: 3  },
    { name: 'Áo Chạy Bộ Nike - Trắng / XL',  sku: 'RUN-NK-W-XL',   stock: 5  },
    { name: 'Kính Bơi TYR - Xanh',            sku: 'GOG-TYR-BL',    stock: 2  },
    { name: 'Quần Bơi Arena - Đen / L',       sku: 'SWM-ARN-BK-L',  stock: 7  },
    { name: 'Áo Chống Nắng - Tím / S',        sku: 'SUN-PUR-S',     stock: 4  },
  ];
}
