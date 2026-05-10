import { Component, computed, signal, OnInit } from '@angular/core';
import {
  AdminCustomer,
  AdminCustomerService,
  CustomerOrder,
  ToggleActiveRequest
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

@Component({
  selector:    'app-customers',
  templateUrl: './customers.component.html',
  styleUrls:   ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  // ── State ─────────────────────────────────────────────────────────────────
  searchQuery    = signal('');
  selectedStatus = signal('');
  isLoading      = signal(false);

  customers       = signal<AdminCustomer[]>([]);
  detailCustomer: AdminCustomer | null = null;
  editingCustomer: AdminCustomer | null = null;
  drawerVisible   = false;
  showPassword    = false;

  form: CustomerForm = this.emptyForm();

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

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ── LOAD DATA ─────────────────────────────────────────────────────────────

  loadCustomers(): void {
    this.isLoading.set(true);
    this.adminCustomerService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.customers.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải danh sách customer:', err);
        this.isLoading.set(false);
      }
    });
  }

  // ── COMPUTED ──────────────────────────────────────────────────────────────

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

  filteredCustomers = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    return this.customers().filter(c => {
      const matchStatus = !status || c.status === status;
      const matchSearch = !query
        || c.fullName?.toLowerCase().includes(query)
        || c.email?.toLowerCase().includes(query)
        || c.phone?.includes(query);
      return matchStatus && matchSearch;
    });
  });

  // ── DETAIL MODAL ──────────────────────────────────────────────────────────

  openDetail(customer: AdminCustomer): void {
    this.adminCustomerService.getById(customer.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.detailCustomer = res.data;
        }
      },
      error: (err) => console.error('Lỗi lấy chi tiết customer:', err)
    });
  }

  closeDetail(): void {
    this.detailCustomer = null;
  }

  onDetailOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeDetail();
    }
  }

  // ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────

  toggleActive(customer: AdminCustomer): void {
    const newStatus = customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const request: ToggleActiveRequest = { status: newStatus };

    this.adminCustomerService.toggleActive(customer.id, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.customers.update(list =>
            list.map(c => c.id === customer.id ? { ...c, status: newStatus } : c)
          );
          if (this.detailCustomer?.id === customer.id) {
            this.detailCustomer = { ...this.detailCustomer, status: newStatus };
          }
        }
      },
      error: (err) => console.error('Lỗi toggle active:', err)
    });
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

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
      error: (err) => console.error('Lỗi xóa customer:', err)
    });
  }

  // ── EDIT DRAWER ───────────────────────────────────────────────────────────

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

  saveEdit(): void {
    if (!this.editingCustomer) return;
    this.customers.update(list =>
      list.map(c => c.id === this.editingCustomer!.id
        ? { ...c, ...this.form }
        : c
      )
    );
    this.closeDrawer();
  }

  openEditFromDetail(): void {
    const customer = this.detailCustomer;
    this.closeDetail();
    if (customer) setTimeout(() => this.openEdit(customer), 100);
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

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
