import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {

  selectedPeriod = 'month';
  dateFrom = '2025-06-01';
  dateTo   = '2025-06-30';
  productView: 'revenue' | 'quantity' = 'revenue';

  periods = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week',  label: '7 ngày'  },
    { value: 'month', label: '30 ngày' },
    { value: 'year',  label: 'Năm nay' },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  // ── KPI CARDS ─────────────────────────────────
  kpiCards = [
    {
      icon: 'payments', color: 'blue',
      value: '1.248.500.000đ', label: 'Tổng doanh thu',
      compare: 'so với tháng trước', trend: 18.4,
      history: [40, 55, 45, 60, 50, 70, 65, 80, 72, 85, 78, 100],
    },
    {
      icon: 'shopping_bag', color: 'green',
      value: '3.842', label: 'Tổng đơn hàng',
      compare: 'so với tháng trước', trend: 12.1,
      history: [50, 45, 60, 55, 70, 65, 60, 75, 70, 80, 85, 100],
    },
    {
      icon: 'people', color: 'orange',
      value: '1.156', label: 'Khách hàng mới',
      compare: 'so với tháng trước', trend: -4.3,
      history: [80, 75, 85, 70, 65, 80, 75, 60, 70, 65, 72, 68],
    },
    {
      icon: 'account_balance_wallet', color: 'purple',
      value: '324.600đ', label: 'Giá trị đơn TB',
      compare: 'so với tháng trước', trend: 5.7,
      history: [60, 65, 58, 70, 68, 72, 75, 71, 78, 80, 82, 88],
    },
  ];

  // ── MONTHLY REVENUE ───────────────────────────
  monthlyRevenue = [
    { month: 'T7/24',  revenue: '820tr',  profit: '180tr', revenuePercent: 66, profitPercent: 45 },
    { month: 'T8/24',  revenue: '940tr',  profit: '210tr', revenuePercent: 76, profitPercent: 52 },
    { month: 'T9/24',  revenue: '870tr',  profit: '195tr', revenuePercent: 70, profitPercent: 49 },
    { month: 'T10/24', revenue: '1.05tỷ', profit: '240tr', revenuePercent: 85, profitPercent: 60 },
    { month: 'T11/24', revenue: '1.18tỷ', profit: '270tr', revenuePercent: 95, profitPercent: 68 },
    { month: 'T12/24', revenue: '1.24tỷ', profit: '285tr', revenuePercent: 100, profitPercent: 72 },
    { month: 'T1/25',  revenue: '980tr',  profit: '220tr', revenuePercent: 79, profitPercent: 55 },
    { month: 'T2/25',  revenue: '860tr',  profit: '192tr', revenuePercent: 69, profitPercent: 48 },
    { month: 'T3/25',  revenue: '1.02tỷ', profit: '232tr', revenuePercent: 82, profitPercent: 58 },
    { month: 'T4/25',  revenue: '1.08tỷ', profit: '248tr', revenuePercent: 87, profitPercent: 62 },
    { month: 'T5/25',  revenue: '1.15tỷ', profit: '265tr', revenuePercent: 93, profitPercent: 66 },
    { month: 'T6/25',  revenue: '1.25tỷ', profit: '288tr', revenuePercent: 101, profitPercent: 72 },
  ];

  revenueYLabels = ['1.2tỷ', '900tr', '600tr', '300tr', '0'];

  // ── ORDER FUNNEL ──────────────────────────────
  orderFunnel = [
    { label: 'Đơn tạo',       count: 4210, pct: 100, color: 'blue'   },
    { label: 'Đã xác nhận',   count: 3980, pct: 95,  color: 'teal'   },
    { label: 'Đang giao',     count: 3540, pct: 84,  color: 'orange' },
    { label: 'Hoàn thành',    count: 3200, pct: 76,  color: 'green'  },
    { label: 'Đã hủy',        count: 210,  pct: 5,   color: 'red'    },
  ];

  conversionRates = [
    { label: 'Tỷ lệ hoàn thành', value: '76.0%', delta: '+3.2%', up: true  },
    { label: 'Tỷ lệ hủy',        value: '5.0%',  delta: '-1.1%', up: true  },
    { label: 'Tỷ lệ hoàn hàng',  value: '2.3%',  delta: '+0.4%', up: false },
  ];

  // ── TOP PRODUCTS ──────────────────────────────
  topProducts = [
    { name: 'Áo Chạy Bộ Nike Dri-FIT',   sku: 'RUN-NK-DRF', category: 'Chạy bộ',   revenue: 156400000, sold: 524, share: 12.5, trend: 18  },
    { name: 'Giày Bơi Speedo Aqua Kick', sku: 'SWM-SPD-AK',  category: 'Bơi lội',   revenue: 134200000, sold: 382, share: 10.7, trend: 6   },
    { name: 'Kính Bơi TYR Special Ops',  sku: 'GOG-TYR-SO',  category: 'Bơi lội',   revenue: 98600000,  sold: 447, share: 7.9,  trend: 24  },
    { name: 'Áo Chống Nắng UPF50+',      sku: 'SUN-DCT-50',  category: 'Chống nắng', revenue: 87300000, sold: 291, share: 7.0,  trend: -3  },
    { name: 'Giày Adidas Ultraboost 22', sku: 'RUN-AD-UB22', category: 'Chạy bộ',   revenue: 214500000, sold: 215, share: 17.2, trend: 11  },
    { name: 'Mũ Bơi Speedo Fastskin',    sku: 'CAP-SPD-FS',  category: 'Bơi lội',   revenue: 42800000,  sold: 856, share: 3.4,  trend: -7  },
    { name: 'Quần Bơi Arena Carbon',     sku: 'SWM-ARN-CB',  category: 'Bơi lội',   revenue: 76200000,  sold: 254, share: 6.1,  trend: 9   },
  ];

  // ── CATEGORY REVENUE ──────────────────────────
  categoryRevenue = [
    { name: 'Bơi lội',    pct: 34, color: '#3b82f6' },
    { name: 'Chạy bộ',    pct: 28, color: '#22c55e' },
    { name: 'Chống nắng', pct: 16, color: '#f97316' },
    { name: 'Bóng đá',    pct: 12, color: '#a855f7' },
    { name: 'Tennis',     pct: 7,  color: '#f59e0b' },
    { name: 'Khác',       pct: 3,  color: '#94a3b8' },
  ];

  totalCatRevenue = '1.25tỷ';

  get donutStyle(): SafeStyle {
    let deg = 0;
    const segments = this.categoryRevenue.map(c => {
      const start = deg;
      deg += c.pct * 3.6;
      return `${c.color} ${start}deg ${deg}deg`;
    });
    const gradient = `conic-gradient(${segments.join(', ')})`;
    return this.sanitizer.bypassSecurityTrustStyle(gradient);
  }

  // ── CUSTOMER DATA ─────────────────────────────
  customerData = [
    { month: 'T1', new: 142, returning: 210, newPct: 40, returnPct: 60 },
    { month: 'T2', new: 128, returning: 198, newPct: 39, returnPct: 61 },
    { month: 'T3', new: 187, returning: 235, newPct: 44, returnPct: 56 },
    { month: 'T4', new: 215, returning: 268, newPct: 45, returnPct: 55 },
    { month: 'T5', new: 248, returning: 290, newPct: 46, returnPct: 54 },
    { month: 'T6', new: 196, returning: 312, newPct: 39, returnPct: 61 },
  ];

  customerStats = [
    { value: '1.116', label: 'Tổng KH tháng này' },
    { value: '196',   label: 'Khách mới' },
    { value: '312',   label: 'Quay lại' },
    { value: '28%',   label: 'Tỷ lệ quay lại' },
  ];

  // ── HEATMAP ───────────────────────────────────
  heatmapXLabels = ['6h','8h','10h','12h','14h','16h','18h','20h','22h'];

  heatmapData = [
    { label: 'T2', cells: [3, 8, 22, 35, 28, 40, 55, 48, 18] },
    { label: 'T3', cells: [2, 10, 25, 38, 30, 42, 58, 50, 20] },
    { label: 'T4', cells: [4, 7,  20, 32, 26, 38, 52, 45, 15] },
    { label: 'T5', cells: [5, 12, 28, 42, 35, 48, 62, 55, 22] },
    { label: 'T6', cells: [6, 15, 35, 50, 45, 60, 78, 68, 30] },
    { label: 'T7', cells: [10, 20, 45, 65, 58, 75, 90, 82, 40] },
    { label: 'CN', cells: [12, 22, 48, 70, 62, 80, 95, 88, 45] },
  ];

  getHeatClass(val: number): string {
    if (val >= 70) return 'h4';
    if (val >= 50) return 'h3';
    if (val >= 30) return 'h2';
    if (val >= 10) return 'h1';
    return 'h0';
  }

  // ── BRAND REVENUE ─────────────────────────────
  brandRevenue = [
    { name: 'ADIDAS',    initials: 'AD', color: '#dc2626', revenue: '284tr', pct: 100, trend: 14  },
    { name: 'NIKE',      initials: 'NK', color: '#0f172a', revenue: '251tr', pct: 88,  trend: 9   },
    { name: 'DECATHLON', initials: 'DE', color: '#2563eb', revenue: '198tr', pct: 70,  trend: 6   },
    { name: 'SPEEDO',    initials: 'SP', color: '#d97706', revenue: '142tr', pct: 50,  trend: -2  },
    { name: 'NABAIJI',   initials: 'NA', color: '#0891b2', revenue: '98tr',  pct: 35,  trend: 18  },
    { name: 'KIPRUN',    initials: 'KI', color: '#16a34a', revenue: '76tr',  pct: 27,  trend: 22  },
  ];

  // ── COMPARE TABLE ─────────────────────────────
  compareRows = [
    { metric: 'Doanh thu',       current: '1.248tr', prev: '1.056tr', delta: '+18.2%', up: true  },
    { metric: 'Số đơn hàng',     current: '3.842',   prev: '3.421',   delta: '+12.3%', up: true  },
    { metric: 'Giá trị đơn TB',  current: '324.600đ', prev: '307.000đ', delta: '+5.7%', up: true },
    { metric: 'Khách hàng mới',  current: '1.156',   prev: '1.208',   delta: '-4.3%',  up: false },
    { metric: 'Tỷ lệ hủy đơn',  current: '5.0%',    prev: '6.1%',    delta: '-1.1%',  up: true  },
    { metric: 'Tỷ lệ hoàn hàng', current: '2.3%',   prev: '1.9%',    delta: '+0.4%',  up: false },
    { metric: 'Chi phí vận chuyển', current: '87tr', prev: '92tr',    delta: '-5.4%',  up: true  },
  ];
}
