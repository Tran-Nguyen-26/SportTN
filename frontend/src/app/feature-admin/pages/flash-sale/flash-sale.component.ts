import { Component, OnDestroy, OnInit } from '@angular/core';

export interface FlashProduct {
  id: number;
  name: string;
  sku: string;
  originalPrice: number;
  salePrice: number;
  flashStock: number | null;
  originalStock: number;
  sold: number;
  thumbColor: string;
  tempSalePrice?: number;
}

export interface FlashSale {
  id: number;
  name: string;
  description: string;
  date: string;        // dd/MM/yyyy
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  active: boolean;
  showCountdown: boolean;
  products: FlashProduct[];
}

export interface FlashSaleForm {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  active: boolean;
  showCountdown: boolean;
}

// Danh sách sản phẩm có thể thêm vào flash sale
export interface PickerProduct {
  id: number;
  name: string;
  sku: string;
  originalPrice: number;
  stock: number;
  thumbColor: string;
  tempSalePrice?: number;
}

@Component({
  selector: 'app-flash-sale',
  templateUrl: './flash-sale.component.html',
  styleUrls: ['./flash-sale.component.css']
})
export class FlashSaleComponent implements OnInit, OnDestroy {

  searchQuery = '';
  selectedStatus = '';
  drawerVisible = false;
  pickerVisible = false;
  editingSale: FlashSale | null = null;
  pickingForSale: FlashSale | null = null;
  pickerQuery = '';
  selectedProductIds = new Set<number>();
  liveCountdown = '00:00:00';
  private timer: any;

  statusTabs = [
    { value: '',          label: 'Tất cả'       },
    { value: 'LIVE',      label: 'Đang diễn ra' },
    { value: 'UPCOMING',  label: 'Sắp diễn ra'  },
    { value: 'ENDED',     label: 'Đã kết thúc'  },
    { value: 'INACTIVE',  label: 'Tắt'           },
  ];

  form: FlashSaleForm = this.emptyForm();

  flashSales: FlashSale[] = [
    {
      id: 1,
      name: 'Flash Sale Thứ 6 - Đồ Bơi',
      description: 'Giảm đến 40% toàn bộ đồ bơi',
      date: '18/07/2025',
      startTime: '18:00',
      endTime: '20:00',
      active: true,
      showCountdown: true,
      products: [
        { id: 1, name: 'Kính Bơi TYR Special Ops',  sku: 'GOG-TYR-SO', originalPrice: 450000, salePrice: 270000, flashStock: 50,  originalStock: 120, sold: 28, thumbColor: '#dbeafe' },
        { id: 2, name: 'Mũ Bơi Speedo Fastskin',     sku: 'CAP-SPD-FS', originalPrice: 180000, salePrice: 108000, flashStock: 80,  originalStock: 200, sold: 45, thumbColor: '#fce7f3' },
        { id: 3, name: 'Áo Bơi Arena Carbon',        sku: 'SWM-ARN-CB', originalPrice: 850000, salePrice: 595000, flashStock: 30,  originalStock: 60,  sold: 12, thumbColor: '#d1fae5' },
      ]
    },
    {
      id: 2,
      name: 'Flash Sale Cuối Tuần - Giày Chạy Bộ',
      description: 'Giảm 30% giày chạy bộ Nike & Adidas',
      date: '20/07/2025',
      startTime: '10:00',
      endTime: '12:00',
      active: true,
      showCountdown: true,
      products: [
        { id: 4, name: 'Giày Nike Air Zoom Pegasus', sku: 'RUN-NK-AZP', originalPrice: 2800000, salePrice: 1960000, flashStock: 20, originalStock: 45, sold: 8,  thumbColor: '#ede9fe' },
        { id: 5, name: 'Giày Adidas Ultraboost 22',  sku: 'RUN-AD-UB22', originalPrice: 3200000, salePrice: 2240000, flashStock: 15, originalStock: 30, sold: 5,  thumbColor: '#fef3c7' },
      ]
    },
    {
      id: 3,
      name: 'Flash Sale Tối Thứ 2 - Phụ Kiện',
      description: 'Giảm giá phụ kiện thể thao',
      date: '14/07/2025',
      startTime: '21:00',
      endTime: '23:00',
      active: true,
      showCountdown: false,
      products: [
        { id: 6, name: 'Bình Nước Decathlon 750ml', sku: 'ACC-DCT-BTL', originalPrice: 120000, salePrice: 84000, flashStock: 100, originalStock: 200, sold: 100, thumbColor: '#fee2e2' },
      ]
    },
  ];

  // Danh sách sản phẩm để chọn
  allProducts: PickerProduct[] = [
    { id: 10, name: 'Áo Chạy Bộ Nike Dri-FIT',     sku: 'RUN-NK-DRF',  originalPrice: 650000,  stock: 80,  thumbColor: '#dbeafe' },
    { id: 11, name: 'Quần Bơi Arena Wave',           sku: 'SWM-ARN-WV',  originalPrice: 420000,  stock: 60,  thumbColor: '#d1fae5' },
    { id: 12, name: 'Kính Bơi Speedo Biofuse',      sku: 'GOG-SPD-BF',  originalPrice: 380000,  stock: 90,  thumbColor: '#fce7f3' },
    { id: 13, name: 'Giày Tennis Wilson Kaos',       sku: 'TEN-WIL-KS',  originalPrice: 1800000, stock: 25,  thumbColor: '#ede9fe' },
    { id: 14, name: 'Áo Chống Nắng UPF50+ Nam',     sku: 'SUN-DCT-M50', originalPrice: 320000,  stock: 120, thumbColor: '#fef3c7' },
    { id: 15, name: 'Tất Chạy Bộ Compressport',     sku: 'ACC-CPS-SKS', originalPrice: 180000,  stock: 200, thumbColor: '#fee2e2' },
    { id: 16, name: 'Balo Thể Thao Quechua 20L',    sku: 'ACC-QCH-20L', originalPrice: 540000,  stock: 40,  thumbColor: '#f0fdf4' },
    { id: 17, name: 'Áo Bóng Đá Domyos FH100',      sku: 'FTB-DMY-FH1', originalPrice: 280000,  stock: 150, thumbColor: '#eff6ff' },
  ];

  // ── Lifecycle ─────────────────────────────────
  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private startTimer(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    const live = this.flashSales.find(s => this.isLive(s));
    if (live) {
      const end = this.parseDateTime(live.date, live.endTime);
      this.liveCountdown = this.formatCountdown(end.getTime() - Date.now());
    }
  }

  // ── Status helpers ────────────────────────────
  getSaleStatus(sale: FlashSale): string {
    if (!sale.active) return 'INACTIVE';
    if (this.isLive(sale))     return 'LIVE';
    if (this.isUpcoming(sale)) return 'UPCOMING';
    return 'ENDED';
  }

  isLive(sale: FlashSale): boolean {
    if (!sale.active) return false;
    const now   = Date.now();
    const start = this.parseDateTime(sale.date, sale.startTime).getTime();
    const end   = this.parseDateTime(sale.date, sale.endTime).getTime();
    return now >= start && now < end;
  }

  isUpcoming(sale: FlashSale): boolean {
    if (!sale.active) return false;
    return this.parseDateTime(sale.date, sale.startTime).getTime() > Date.now();
  }

  getSaleStatusLabel(sale: FlashSale): string {
    const map: Record<string, string> = {
      LIVE:     'Đang diễn ra',
      UPCOMING: 'Sắp diễn ra',
      ENDED:    'Đã kết thúc',
      INACTIVE: 'Đã tắt',
    };
    return map[this.getSaleStatus(sale)] ?? '';
  }

  getSaleStatusClass(sale: FlashSale): string {
    return this.getSaleStatus(sale).toLowerCase();
  }

  getLiveProgress(sale: FlashSale): number {
    const start = this.parseDateTime(sale.date, sale.startTime).getTime();
    const end   = this.parseDateTime(sale.date, sale.endTime).getTime();
    const now   = Date.now();
    return Math.min(100, Math.round(((now - start) / (end - start)) * 100));
  }

  getUpcomingCountdown(sale: FlashSale): string {
    const diff = this.parseDateTime(sale.date, sale.startTime).getTime() - Date.now();
    return diff > 0 ? this.formatCountdown(diff) : '00:00:00';
  }

  get liveSession(): FlashSale | undefined {
    return this.flashSales.find(s => this.isLive(s));
  }

  // ── Counts ────────────────────────────────────
  activeCount()   { return this.flashSales.filter(s => s.active && !this.isLive(s) && !this.isUpcoming(s) === false).length; }
  upcomingCount() { return this.flashSales.filter(s => this.isUpcoming(s)).length; }
  endedCount()    { return this.flashSales.filter(s => this.getSaleStatus(s) === 'ENDED').length; }

  getTabCount(status: string): number {
    if (!status) return this.flashSales.length;
    return this.flashSales.filter(s => this.getSaleStatus(s) === status).length;
  }

  // ── Filter ────────────────────────────────────
  get filteredSales(): FlashSale[] {
    return this.flashSales.filter(s => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q);
      const matchS = !this.selectedStatus || this.getSaleStatus(s) === this.selectedStatus;
      return matchQ && matchS;
    });
  }

  // ── Product helpers ───────────────────────────
  getDiscount(p: FlashProduct): number {
    return Math.round((p.originalPrice - p.salePrice) / p.originalPrice * 100);
  }

  getSoldPercent(p: FlashProduct): number {
    const stock = p.flashStock || p.originalStock;
    return Math.min(100, Math.round((p.sold / stock) * 100));
  }

  getTotalFlashStock(sale: FlashSale): number {
    return sale.products.reduce((s, p) => s + (p.flashStock || p.originalStock), 0);
  }

  getTotalSold(sale: FlashSale): number {
    return sale.products.reduce((s, p) => s + p.sold, 0);
  }

  getEstRevenue(sale: FlashSale): number {
    return sale.products.reduce((s, p) => s + p.salePrice * p.sold, 0);
  }

  removeProduct(sale: FlashSale, productId: number): void {
    sale.products = sale.products.filter(p => p.id !== productId);
  }

  // ── Product picker ────────────────────────────
  openProductPicker(sale: FlashSale): void {
    this.pickingForSale     = sale;
    this.selectedProductIds = new Set(sale.products.map(p => p.id));
    this.pickerQuery        = '';
    this.pickerVisible      = true;
  }

  isInSale(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }

  toggleProductInSale(p: PickerProduct): void {
    if (this.selectedProductIds.has(p.id)) {
      this.selectedProductIds.delete(p.id);
    } else {
      this.selectedProductIds.add(p.id);
      if (!p.tempSalePrice) p.tempSalePrice = Math.round(p.originalPrice * 0.7);
    }
  }

  confirmProductPicker(): void {
    if (!this.pickingForSale) return;
    const sale = this.pickingForSale;
    // Giữ lại sản phẩm đã có, thêm sản phẩm mới
    const existingIds = new Set(sale.products.map(p => p.id));
    this.selectedProductIds.forEach(id => {
      if (!existingIds.has(id)) {
        const picker = this.allProducts.find(p => p.id === id);
        if (picker) {
          sale.products.push({
            id:            picker.id,
            name:          picker.name,
            sku:           picker.sku,
            originalPrice: picker.originalPrice,
            salePrice:     picker.tempSalePrice || Math.round(picker.originalPrice * 0.7),
            flashStock:    null,
            originalStock: picker.stock,
            sold:          0,
            thumbColor:    picker.thumbColor,
          });
        }
      }
    });
    // Xóa sản phẩm đã bỏ chọn
    sale.products = sale.products.filter(p => this.selectedProductIds.has(p.id));
    this.pickerVisible = false;
  }

  get filteredPickerProducts(): PickerProduct[] {
    const q = this.pickerQuery.toLowerCase();
    if (!q) return this.allProducts;
    return this.allProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  onPickerOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.pickerVisible = false;
  }

  // ── Drawer ────────────────────────────────────
  openDrawer(sale?: FlashSale): void {
    if (sale) {
      this.editingSale = sale;
      this.form = {
        name:          sale.name,
        description:   sale.description,
        date:          this.toInputDate(sale.date),
        startTime:     sale.startTime,
        endTime:       sale.endTime,
        active:        sale.active,
        showCountdown: sale.showCountdown,
      };
    } else {
      this.editingSale = null;
      this.form = this.emptyForm();
    }
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.editingSale   = null;
    this.form          = this.emptyForm();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.date && this.form.startTime && this.form.endTime);
  }

  save(): void {
    if (!this.isFormValid()) return;
    const dateStr = this.fromInputDate(this.form.date);
    if (this.editingSale) {
      Object.assign(this.editingSale, { ...this.form, date: dateStr });
    } else {
      this.flashSales.unshift({
        id:       Date.now(),
        ...this.form,
        date:     dateStr,
        products: [],
      });
    }
    this.closeDrawer();
  }

  deleteSale(id: number): void {
    this.flashSales = this.flashSales.filter(s => s.id !== id);
  }

  getDuration(): string {
    const [sh, sm] = this.form.startTime.split(':').map(Number);
    const [eh, em] = this.form.endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff <= 0) return 'Không hợp lệ';
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `${h} giờ ${m > 0 ? m + ' phút' : ''}` : `${m} phút`;
  }

  // ── Utils ─────────────────────────────────────
  private parseDateTime(date: string, time: string): Date {
    // date: dd/MM/yyyy, time: HH:mm
    const [d, m, y] = date.split('/').map(Number);
    const [h, mn]   = time.split(':').map(Number);
    return new Date(y, m - 1, d, h, mn, 0);
  }

  private formatCountdown(ms: number): string {
    if (ms <= 0) return '00:00:00';
    const s  = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }

  private toInputDate(ddmmyyyy: string): string {
    const [d, m, y] = ddmmyyyy.split('/');
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }

  private fromInputDate(yyyy_mm_dd: string): string {
    const [y, m, d] = yyyy_mm_dd.split('-');
    return `${d}/${m}/${y}`;
  }

  private emptyForm(): FlashSaleForm {
    return {
      name: '', description: '', date: '',
      startTime: '', endTime: '',
      active: true, showCountdown: true,
    };
  }
}
