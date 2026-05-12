import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AdminCustomer,
  AdminCustomerService,
  ToggleActiveRequest,
  UpdateCustomerRequest
} from '../../../core/services/user/admin-customer.service';

export interface CustomerForm {
  fullName: string;
  phone:    string;
  address:  string;
  gender:   string;
  birthday: string;
  note:     string;
  status:   string;
}

export interface CustomerFilterParams {
  page?:    number;
  size?:    number;
  keyword?: string;
  status?:  string;
}

@Component({
  selector:    'app-customers',
  templateUrl: './customers.component.html',
  styleUrls:   ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {

  // ── State ─────────────────────────────────────────────────────────────────
  isLoading      = false;
  customers      = signal<AdminCustomer[]>([]);
  totalElements  = 0;
  totalPages     = 0;
  pageIndex      = 0;
  pageSize       = 20;

  searchKeyword  = '';
  selectedStatus = '';

  detailCustomer:  AdminCustomer | null = null;
  editingCustomer: AdminCustomer | null = null;
  drawerVisible    = false;
  showPassword     = false;

  form: CustomerForm = this.emptyForm();

  private searchSubject = new Subject<string>();

  // ── Options ───────────────────────────────────────────────────────────────
  statusOptions = [
    { value: '',         label: 'Tất cả'          },
    { value: 'ACTIVE',   label: 'Hoạt động'       },
    { value: 'INACTIVE', label: 'Không hoạt động' },
  ];

  genderOptions = [
    { value: '',       label: 'Không xác định' },
    { value: 'MALE',   label: 'Nam'            },
    { value: 'FEMALE', label: 'Nữ'             },
  ];

  constructor(private adminCustomerService: AdminCustomerService) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCustomers();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.searchKeyword = keyword;
      this.pageIndex     = 0;
      this.loadCustomers();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadCustomers(): void {
    this.isLoading = true;

    const params: CustomerFilterParams = {
      page:    this.pageIndex,
      size:    this.pageSize,
      keyword: this.searchKeyword  || undefined,
      status:  this.selectedStatus || undefined,
    };

    this.adminCustomerService.getAll(params).subscribe({
      next: (res) => {
        if (res.data) {
          this.customers.set(res.data.content);
          this.totalElements = res.data.totalElements;
          this.totalPages    = res.data.totalPages;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[CUSTOMER] Lỗi tải danh sách:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Computed stats (từ data hiện tại trên trang) ──────────────────────────
  totalCustomers  = computed(() => this.customers().length);

  activeCustomers = computed(() =>
    this.customers().filter(c => c.status === 'ACTIVE').length
  );

  totalOrders = computed(() =>
    this.customers().reduce((s, c) => s + (c.totalOrders ?? 0), 0)
  );

  totalRevenueM = computed(() => {
    const total = this.customers().reduce((s, c) => s + Number(c.totalSpent ?? 0), 0);
    return (total / 1_000_000).toFixed(1);
  });

  // ── Search & Filter ───────────────────────────────────────────────────────
  onSearchInput(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadCustomers();
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
      this.loadCustomers();
    }
  }

  goToPreviousPage(): void { this.goToPage(this.pageIndex - 1); }
  goToNextPage(): void     { this.goToPage(this.pageIndex + 1); }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // ── Detail Modal ──────────────────────────────────────────────────────────
  openDetail(customer: AdminCustomer): void {
    this.adminCustomerService.getById(customer.id).subscribe({
      next: (res) => { if (res.data) this.detailCustomer = res.data; },
      error: (err) => console.error('[CUSTOMER] Lỗi lấy chi tiết:', err)
    });
  }

  closeDetail(): void { this.detailCustomer = null; }

  onDetailOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeDetail();
    }
  }

  // ── Toggle Active ─────────────────────────────────────────────────────────
  toggleActive(customer: AdminCustomer): void {
    const newStatus = customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const request: ToggleActiveRequest = { status: newStatus };

    this.adminCustomerService.toggleActive(customer.id, request).subscribe({
      next: (res) => {
        if (res.data) {
          this.customers.update(list =>
            list.map(c => c.id === customer.id ? { ...c, status: newStatus } : c)
          );
          if (this.detailCustomer?.id === customer.id) {
            this.detailCustomer = { ...this.detailCustomer, status: newStatus };
          }
        }
      },
      error: (err) => console.error('[CUSTOMER] Lỗi toggle active:', err)
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  deleteCustomer(id: number): void {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;

    this.adminCustomerService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.customers.update(list => list.filter(c => c.id !== id));
          if (this.detailCustomer?.id === id)  this.closeDetail();
          if (this.editingCustomer?.id === id) this.closeDrawer();
        }
      },
      error: (err) => console.error('[CUSTOMER] Lỗi xóa:', err)
    });
  }

  // ── Edit Drawer ───────────────────────────────────────────────────────────
  openEdit(customer: AdminCustomer): void {
    this.editingCustomer = customer;
    this.form = {
      fullName: customer.fullName ?? '',
      phone:    customer.phone    ?? '',
      address:  customer.address  ?? '',
      gender:   customer.gender   ?? '',
      birthday: customer.birthday ?? '',
      note:     customer.note     ?? '',
      status:   customer.status,
    };
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible   = false;
    this.editingCustomer = null;
    this.form = this.emptyForm();
  }

  onDrawerOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('drawer-overlay')) {
      this.closeDrawer();
    }
  }

  openEditFromDetail(): void {
    const customer = this.detailCustomer;
    this.closeDetail();
    if (customer) setTimeout(() => this.openEdit(customer), 100);
  }

  saveEdit(): void {
    if (!this.editingCustomer || !this.isFormValid()) return;

    this.isLoading = true;

    const updateRequest: UpdateCustomerRequest = {
      fullName: this.form.fullName,
      phone:    this.form.phone,
      address:  this.form.address,
      gender:   this.form.gender,
      birthday: this.form.birthday,
      note:     this.form.note,
      status:   this.form.status
    };

    this.adminCustomerService.updateCustomer(this.editingCustomer.id, updateRequest).subscribe({
      next: (res) => {
        if (res.data) {
          this.customers.update(list =>
            list.map(c => c.id === res.data!.id ? { ...c, ...res.data } : c)
          );
          if (this.detailCustomer?.id === res.data.id) {
            this.detailCustomer = { ...this.detailCustomer, ...res.data };
          }
          this.closeDrawer();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[CUSTOMER] Lỗi cập nhật:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private emptyForm(): CustomerForm {
    return {
      fullName: '',
      phone:    '',
      address:  '',
      gender:   '',
      birthday: '',
      note:     '',
      status:   'ACTIVE'
    };
  }

  isFormValid(): boolean {
    return !!(this.form.fullName && this.form.phone);
  }

  formatPrice(price: number): string {
    return Number(price)?.toLocaleString('vi-VN') + 'đ';
  }

  getAvatarColor(index: number): string {
    const colors = ['#3b82f6', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#db2777'];
    return colors[index % colors.length];
  }

  getAvatarColorById(id: number): string {
    return this.getAvatarColor(id - 1);
  }

  getOrderStatusClass(status: string): string {
    const map: Record<string, string> = {
      DELIVERED: 'badge-green',
      SHIPPING:  'badge-blue',
      PENDING:   'badge-yellow',
      CANCELLED: 'badge-red',
    };
    return map[status] ?? 'badge-gray';
  }

  getOrderStatusLabel(status: string): string {
    const map: Record<string, string> = {
      DELIVERED: 'Đã giao',
      SHIPPING:  'Đang giao',
      PENDING:   'Chờ xử lý',
      CANCELLED: 'Đã hủy',
    };
    return map[status] ?? status;
  }

  getGenderLabel(gender: string): string {
    return gender === 'MALE' ? 'Nam'
      : gender === 'FEMALE' ? 'Nữ'
        : 'Không xác định';
  }

  protected readonly Math = Math;
}
