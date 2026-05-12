import { Component, OnInit } from '@angular/core';
import {
  DashboardService,
  DashboardStatsResponse,
  RevenueChartResponse,
  TopProductResponse,
  LowStockResponse,
  RecentOrderResponse,
  OrderStatusSummary
} from "../../../core/services/overview/dashboard.service";
import { forkJoin } from 'rxjs';
import { ORDER_STATUS_LABEL } from '../../../core/services/order/order.service';
import { ReportService } from "../../../core/services/report/report.service";

interface StatItem {
  icon:  string;
  color: string;
  value: string;
  label: string;
  trend: number;
}

interface OrderStatusItem {
  label:   string;
  count:   number;
  percent: number;
  color:   string;
}

@Component({
  selector:    'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls:   ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isExporting    = false;
  loading        = false;
  error: string | null = null;
  selectedPeriod = 'today';

  today: string = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  periods = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week',  label: '7 ngày'  },
    { value: 'month', label: '30 ngày' },
  ];

  // ── API Data ───────────────────────────────────────────────────────────────
  stats: StatItem[]                   = [];
  revenueData: RevenueChartResponse[] = [];
  topProducts: TopProductResponse[]   = [];
  lowStockItems: LowStockResponse[]   = [];
  recentOrders: RecentOrderResponse[] = [];
  orderStatuses: OrderStatusItem[]    = [];

  private readonly statusColorMap: Record<string, string> = {
    PENDING:    'yellow',
    CONFIRMED:  'blue',
    PROCESSING: 'blue',
    SHIPPING:   'orange',
    DELIVERED:  'green',
    CANCELLED:  'red',
    REFUNDED:   'red',
  };

  private readonly statusClassMap: Record<string, string> = {
    PENDING:    'badge-yellow',
    CONFIRMED:  'badge-blue',
    PROCESSING: 'badge-blue',
    SHIPPING:   'badge-orange',
    DELIVERED:  'badge-green',
    CANCELLED:  'badge-red',
    REFUNDED:   'badge-red',
  };

  constructor(
    private dashboardService: DashboardService,
    private reportService:    ReportService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  loadDashboardData(): void {
    this.loading = true;
    this.error   = null;

    const period = this.selectedPeriod === 'today' ? 'week' : this.selectedPeriod as any;

    forkJoin({
      stats:         this.dashboardService.getStats(this.selectedPeriod as any),
      revenueChart:  this.dashboardService.getRevenueChart(period),
      topProducts:   this.dashboardService.getTopProducts(period),
      lowStock:      this.dashboardService.getLowStock(10),
      recentOrders:  this.dashboardService.getRecentOrders(10),
      orderStatuses: this.dashboardService.getOrderStatusSummary()
    }).subscribe({
      next: ({ stats, revenueChart, topProducts, lowStock, recentOrders, orderStatuses }) => {
        this.mapStatsData(stats.data);
        this.revenueData   = this.processRevenueData(revenueChart.data   ?? []);
        this.topProducts   = topProducts.data   ?? [];
        this.lowStockItems = lowStock.data       ?? [];
        this.recentOrders  = recentOrders.data   ?? [];
        this.orderStatuses = this.mapOrderStatuses(orderStatuses.data ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error('[DASHBOARD] Lỗi load:', err);
        this.error   = 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadDashboardData();
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  exportRevenue(): void {
    this.isExporting = true;

    const to   = new Date();
    const from = new Date();
    from.setHours(0, 0, 0, 0);

    switch (this.selectedPeriod) {
      case 'week':  from.setDate(from.getDate() - 6);  break;
      case 'month': from.setDate(from.getDate() - 30); break;
    }

    const periodName: Record<string, string> = {
      today: 'hom-nay',
      week:  '7-ngay',
      month: '30-ngay'
    };

    this.reportService.exportRevenue(this.formatDate(from), this.formatDate(to)).subscribe({
      next: (blob) => {
        const url     = window.URL.createObjectURL(blob);
        const link    = document.createElement('a');
        link.href     = url;
        link.download = `bao-cao-doanh-thu-${periodName[this.selectedPeriod]}-${this.formatDate(to)}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (err) => {
        console.error('[REPORT] Lỗi xuất báo cáo:', err);
        this.isExporting = false;
      }
    });
  }

  // ── Y Labels động ─────────────────────────────────────────────────────────
  get yLabels(): string[] {
    if (!this.revenueData.length) return ['0', '0', '0', '0', '0'];

    const maxRevenue = Math.max(...this.revenueData.map(d => d.revenue));
    if (maxRevenue === 0) return ['0', '0', '0', '0', '0'];

    const step = maxRevenue / 4;
    return [
      this.formatShort(maxRevenue),
      this.formatShort(step * 3),
      this.formatShort(step * 2),
      this.formatShort(step),
      '0'
    ];
  }

  private formatShort(value: number): string {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace('.0', '') + 'tỷ';
    if (value >= 1_000_000)     return (value / 1_000_000).toFixed(1).replace('.0', '')     + 'tr';
    if (value >= 1_000)         return (value / 1_000).toFixed(1).replace('.0', '')         + 'k';
    return value.toFixed(0);
  }

  // ── Map helpers ────────────────────────────────────────────────────────────
  private mapStatsData(apiStats: DashboardStatsResponse): void {
    this.stats = [
      {
        icon:  'payments',
        color: 'blue',
        value: this.formatCurrency(apiStats.revenue),
        label: `Doanh thu ${this.selectedPeriod === 'today' ? 'hôm nay' : this.periodLabel}`,
        trend: apiStats.revenueTrend
      },
      {
        icon:  'shopping_bag',
        color: 'green',
        value: apiStats.newOrders.toLocaleString(),
        label: `Đơn hàng mới ${this.periodLabel}`,
        trend: apiStats.orderTrend
      },
      {
        icon:  'people',
        color: 'orange',
        value: apiStats.newCustomers.toLocaleString(),
        label: `Khách hàng mới ${this.periodLabel}`,
        trend: apiStats.customerTrend
      },
      {
        icon:  'inventory_2',
        color: 'purple',
        value: apiStats.totalProducts.toLocaleString(),
        label: 'Sản phẩm đang bán',
        trend: 0
      },
    ];
  }

  private mapOrderStatuses(data: OrderStatusSummary[]): OrderStatusItem[] {
    const total = data.reduce((sum, s) => sum + s.count, 0);
    return data.map(s => ({
      label:   ORDER_STATUS_LABEL[s.status as keyof typeof ORDER_STATUS_LABEL] ?? s.status,
      count:   s.count,
      percent: total > 0 ? Math.round((s.count / total) * 100) : 0,
      color:   this.statusColorMap[s.status] ?? 'blue'
    }));
  }

  private processRevenueData(data: RevenueChartResponse[]): RevenueChartResponse[] {
    if (!data.length) return [];
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const maxOrders  = Math.max(...data.map(d => d.orders));
    return data.map(item => ({
      ...item,
      revenuePercent: maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0,
      orderPercent:   maxOrders  > 0 ? (item.orders  / maxOrders)  * 100 : 0,
    }));
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  get periodLabel(): string {
    const map: Record<string, string> = {
      today: 'hôm qua', week: 'tuần trước', month: 'tháng trước'
    };
    return map[this.selectedPeriod] ?? '';
  }

  get currentPeriodLabel(): string {
    return this.periods.find(p => p.value === this.selectedPeriod)?.label ?? '';
  }

  getStatusClass(status: string): string {
    return this.statusClassMap[status] ?? 'badge-blue';
  }

  getStatusLabel(status: string): string {
    return ORDER_STATUS_LABEL[status as keyof typeof ORDER_STATUS_LABEL] ?? status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', currency: 'VND', minimumFractionDigits: 0
    }).format(amount);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
