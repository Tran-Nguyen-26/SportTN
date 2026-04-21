import { Component, computed, signal } from '@angular/core';

export type VoucherType = 'PERCENT' | 'FIXED';

export interface Voucher {
  id: number;
  code: string;
  description: string;
  type: VoucherType;
  discountValue: number;
  maxDiscount: number | null;   // chỉ dùng khi type = PERCENT
  minOrderValue: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface VoucherForm {
  code: string;
  description: string;
  type: VoucherType;
  discountValue: number | null;
  maxDiscount: number | null;
  minOrderValue: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  startDate: string;
  endDate: string;
  active: boolean;
}

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent {

  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  drawerVisible = false;
  editingVoucher: Voucher | null = null;

  typeOptions = [
    { value: '',        label: 'Tất cả loại' },
    { value: 'PERCENT', label: 'Phần trăm' },
    { value: 'FIXED',   label: 'Số tiền cố định' },
  ];

  statusOptions = [
    { value: '',          label: 'Tất cả trạng thái' },
    { value: 'ACTIVE',    label: 'Đang hoạt động' },
    { value: 'SCHEDULED', label: 'Chưa bắt đầu' },
    { value: 'EXPIRED',   label: 'Hết hạn' },
    { value: 'USED_UP',   label: 'Hết lượt' },
    { value: 'INACTIVE',  label: 'Tắt' },
  ];

  vouchers: Voucher[] = [
    {
      id: 1,  code: 'SUMMER25',    description: 'Giảm 25% mùa hè',
      type: 'PERCENT',  discountValue: 25,  maxDiscount: 150000,
      minOrderValue: 300000,  usageLimit: 200,  perUserLimit: 1,
      usedCount: 148, startDate: '01/06/2025', endDate: '30/06/2025', active: true
    },
    {
      id: 2,  code: 'FREESHIP',    description: 'Miễn phí vận chuyển',
      type: 'FIXED',    discountValue: 30000, maxDiscount: null,
      minOrderValue: 200000,  usageLimit: null, perUserLimit: 1,
      usedCount: 312, startDate: '01/01/2025', endDate: '31/12/2025', active: true
    },
    {
      id: 3,  code: 'NEWUSER50',   description: 'Chào khách hàng mới',
      type: 'FIXED',    discountValue: 50000, maxDiscount: null,
      minOrderValue: 500000,  usageLimit: 500,  perUserLimit: 1,
      usedCount: 500, startDate: '01/01/2025', endDate: '31/12/2025', active: true
    },
    {
      id: 4,  code: 'SPORT30',     description: 'Giảm 30% đồ thể thao',
      type: 'PERCENT',  discountValue: 30,  maxDiscount: 200000,
      minOrderValue: 400000,  usageLimit: 100,  perUserLimit: 2,
      usedCount: 67, startDate: '15/07/2025', endDate: '15/08/2025', active: true
    },
    {
      id: 5,  code: 'SWIM2025',    description: 'Ưu đãi đồ bơi lội',
      type: 'PERCENT',  discountValue: 15,  maxDiscount: 100000,
      minOrderValue: 250000,  usageLimit: 300,  perUserLimit: 1,
      usedCount: 89, startDate: '01/08/2025', endDate: '31/08/2025', active: false
    },
    {
      id: 6,  code: 'FLASH100K',   description: 'Flash sale giảm 100k',
      type: 'FIXED',    discountValue: 100000, maxDiscount: null,
      minOrderValue: 800000,  usageLimit: 50,   perUserLimit: 1,
      usedCount: 12, startDate: '20/07/2025', endDate: '20/07/2025', active: true
    },
    {
      id: 7,  code: 'VIP20',       description: 'Ưu đãi khách VIP',
      type: 'PERCENT',  discountValue: 20,  maxDiscount: 500000,
      minOrderValue: null, usageLimit: null, perUserLimit: null,
      usedCount: 34, startDate: '01/01/2025', endDate: '31/12/2025', active: true
    },
    {
      id: 8,  code: 'TETHOLIDAY',  description: 'Khuyến mãi dịp Tết',
      type: 'PERCENT',  discountValue: 40,  maxDiscount: 300000,
      minOrderValue: 600000,  usageLimit: 1000, perUserLimit: 1,
      usedCount: 1000, startDate: '01/01/2025', endDate: '10/02/2025', active: true
    },
  ];

  form: VoucherForm = this.emptyForm();

  // ── Computed stats ──────────────────────────
  activeCount() {
    return this.vouchers.filter(v => this.getStatus(v) === 'ACTIVE').length;
  }

  scheduledCount() {
    return this.vouchers.filter(v => this.getStatus(v) === 'SCHEDULED').length;
  }

  expiredCount() {
    return this.vouchers.filter(v =>
      ['EXPIRED', 'USED_UP'].includes(this.getStatus(v))
    ).length;
  }

  // ── Filter ──────────────────────────────────
  get filteredVouchers(): Voucher[] {
    return this.vouchers.filter(v => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q
        || v.code.toLowerCase().includes(q)
        || v.description.toLowerCase().includes(q);
      const matchType = !this.selectedType || v.type === this.selectedType;
      const matchStatus = !this.selectedStatus || this.getStatus(v) === this.selectedStatus;
      return matchSearch && matchType && matchStatus;
    });
  }

  // ── Status logic ────────────────────────────
  getStatus(v: Voucher): string {
    if (!v.active) return 'INACTIVE';
    if (v.usageLimit !== null && v.usedCount >= v.usageLimit) return 'USED_UP';
    const today = new Date();
    const [d1, m1, y1] = v.startDate.split('/').map(Number);
    const [d2, m2, y2] = v.endDate.split('/').map(Number);
    const start = new Date(y1, m1 - 1, d1);
    const end   = new Date(y2, m2 - 1, d2);
    if (today < start) return 'SCHEDULED';
    if (today > end)   return 'EXPIRED';
    return 'ACTIVE';
  }

  getStatusLabel(v: Voucher): string {
    const map: Record<string, string> = {
      ACTIVE:    'Đang hoạt động',
      SCHEDULED: 'Chưa bắt đầu',
      EXPIRED:   'Hết hạn',
      USED_UP:   'Hết lượt',
      INACTIVE:  'Đã tắt',
    };
    return map[this.getStatus(v)] ?? '';
  }

  getStatusClass(v: Voucher): string {
    const map: Record<string, string> = {
      ACTIVE:    'badge-green',
      SCHEDULED: 'badge-blue',
      EXPIRED:   'badge-gray',
      USED_UP:   'badge-red',
      INACTIVE:  'badge-gray',
    };
    return map[this.getStatus(v)] ?? '';
  }

  isExpired(v: Voucher): boolean {
    return ['EXPIRED', 'USED_UP'].includes(this.getStatus(v));
  }

  getUsagePercent(v: Voucher): number {
    if (!v.usageLimit) return 0;
    return Math.min(100, Math.round((v.usedCount / v.usageLimit) * 100));
  }

  // ── Drawer ──────────────────────────────────
  openDrawer(voucher?: Voucher) {
    if (voucher) {
      this.editingVoucher = voucher;
      this.form = {
        code:          voucher.code,
        description:   voucher.description,
        type:          voucher.type,
        discountValue: voucher.discountValue,
        maxDiscount:   voucher.maxDiscount,
        minOrderValue: voucher.minOrderValue,
        usageLimit:    voucher.usageLimit,
        perUserLimit:  voucher.perUserLimit,
        startDate:     this.toInputDate(voucher.startDate),
        endDate:       this.toInputDate(voucher.endDate),
        active:        voucher.active,
      };
    } else {
      this.editingVoucher = null;
      this.form = this.emptyForm();
    }
    this.drawerVisible = true;
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.editingVoucher = null;
    this.form = this.emptyForm();
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  isFormValid(): boolean {
    return !!(this.form.code && this.form.discountValue && this.form.startDate && this.form.endDate);
  }

  save() {
    if (!this.isFormValid()) return;
    // TODO: gọi API
    this.closeDrawer();
  }

  deleteVoucher(id: number) {
    // TODO: confirm + gọi API
    this.vouchers = this.vouchers.filter(v => v.id !== id);
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    // TODO: toast thông báo đã copy
  }

  generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.form.code = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  // ── Helpers ─────────────────────────────────
  private emptyForm(): VoucherForm {
    return {
      code: '', description: '', type: 'PERCENT',
      discountValue: null, maxDiscount: null,
      minOrderValue: null, usageLimit: null,
      perUserLimit: null, startDate: '', endDate: '', active: true,
    };
  }

  private toInputDate(ddmmyyyy: string): string {
    const [d, m, y] = ddmmyyyy.split('/');
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
}
