import { Component, computed, signal, HostListener } from '@angular/core';

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: string;
  initials: string;
  address?: string;
  gender?: string;
  birthday?: string;
  note?: string;
  orderHistory?: CustomerOrder[];
}

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface CustomerForm {
  fullName: string;
  phone: string;
  address: string;
  gender: string;
  birthday: string;
  note: string;
  status: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {

  searchQuery    = signal('');
  selectedStatus = signal('');

  // ── MODAL & DRAWER STATE ──────────────────────
  detailCustomer: AdminCustomer | null = null;
  drawerVisible  = false;
  editingCustomer: AdminCustomer | null = null;
  showPassword   = false;

  form: CustomerForm = this.emptyForm();

  private emptyForm(): CustomerForm {
    return {
      fullName: '',
      phone:    '',
      address:  '',
      gender:   '',
      birthday: '',
      note:     '',
      status:   'ACTIVE',
    };
  }

  statusOptions = [
    { value: '',         label: 'Tất cả'            },
    { value: 'ACTIVE',   label: 'Hoạt động'         },
    { value: 'INACTIVE', label: 'Không hoạt động'   },
  ];

  genderOptions = [
    { value: '',       label: 'Không xác định' },
    { value: 'MALE',   label: 'Nam'            },
    { value: 'FEMALE', label: 'Nữ'             },
  ];

  customers = signal<AdminCustomer[]>([
    {
      id: 1, fullName: 'Nguyễn Văn An', initials: 'NA',
      email: 'an.nguyen@gmail.com', phone: '0901 234 567',
      totalOrders: 12, totalSpent: 4500000,
      joinDate: '10/01/2024', status: 'ACTIVE',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      gender: 'MALE', birthday: '15/05/1990',
      note: 'Khách VIP, thích sản phẩm chạy bộ',
      orderHistory: [
        { id: '#DH001', date: '20/04/2025', total: 1200000, status: 'DELIVERED', items: 2 },
        { id: '#DH002', date: '15/03/2025', total: 850000,  status: 'DELIVERED', items: 1 },
        { id: '#DH003', date: '10/02/2025', total: 2450000, status: 'DELIVERED', items: 3 },
      ]
    },
    {
      id: 2, fullName: 'Trần Thị Bình', initials: 'TB',
      email: 'binh.tran@gmail.com', phone: '0912 345 678',
      totalOrders: 8, totalSpent: 2800000,
      joinDate: '15/02/2024', status: 'ACTIVE',
      address: '456 Lê Lợi, Q.3, TP.HCM',
      gender: 'FEMALE', birthday: '22/08/1995',
      note: '',
      orderHistory: [
        { id: '#DH010', date: '18/04/2025', total: 450000,  status: 'SHIPPING',  items: 1 },
        { id: '#DH011', date: '01/03/2025', total: 890000,  status: 'DELIVERED', items: 2 },
      ]
    },
    {
      id: 3, fullName: 'Lê Văn Cường', initials: 'LC',
      email: 'cuong.le@gmail.com', phone: '0923 456 789',
      totalOrders: 3, totalSpent: 890000,
      joinDate: '20/03/2024', status: 'ACTIVE',
      address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
      gender: 'MALE', birthday: '03/12/1988',
      note: '',
      orderHistory: [
        { id: '#DH020', date: '10/04/2025', total: 299000,  status: 'DELIVERED', items: 1 },
      ]
    },
    {
      id: 4, fullName: 'Phạm Thị Dung', initials: 'PD',
      email: 'dung.pham@gmail.com', phone: '0934 567 890',
      totalOrders: 24, totalSpent: 12400000,
      joinDate: '05/01/2024', status: 'ACTIVE',
      address: '321 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM',
      gender: 'FEMALE', birthday: '18/03/1992',
      note: 'Khách thân thiết, mua hàng thường xuyên',
      orderHistory: [
        { id: '#DH030', date: '21/04/2025', total: 1800000, status: 'PENDING',   items: 3 },
        { id: '#DH031', date: '05/04/2025', total: 650000,  status: 'DELIVERED', items: 1 },
        { id: '#DH032', date: '20/03/2025', total: 2100000, status: 'DELIVERED', items: 4 },
      ]
    },
    {
      id: 5, fullName: 'Hoàng Văn Em', initials: 'HE',
      email: 'em.hoang@gmail.com', phone: '0945 678 901',
      totalOrders: 1, totalSpent: 299000,
      joinDate: '01/04/2024', status: 'INACTIVE',
      address: '', gender: 'MALE', birthday: '',
      note: 'Tài khoản bị khóa do vi phạm chính sách',
      orderHistory: [
        { id: '#DH040', date: '05/04/2024', total: 299000, status: 'CANCELLED', items: 1 },
      ]
    },
    {
      id: 6, fullName: 'Vũ Thị Phương', initials: 'VP',
      email: 'phuong.vu@gmail.com', phone: '0956 789 012',
      totalOrders: 16, totalSpent: 7200000,
      joinDate: '12/02/2024', status: 'ACTIVE',
      address: '654 Nguyễn Trãi, Q.5, TP.HCM',
      gender: 'FEMALE', birthday: '25/07/1993',
      note: '',
      orderHistory: [
        { id: '#DH050', date: '19/04/2025', total: 890000,  status: 'SHIPPING',  items: 2 },
        { id: '#DH051', date: '02/04/2025', total: 1250000, status: 'DELIVERED', items: 2 },
      ]
    },
    {
      id: 7, fullName: 'Đặng Văn Quân', initials: 'DQ',
      email: 'quan.dang@gmail.com', phone: '0967 890 123',
      totalOrders: 5, totalSpent: 1900000,
      joinDate: '18/03/2024', status: 'ACTIVE',
      address: '987 Cách Mạng Tháng 8, Q.10, TP.HCM',
      gender: 'MALE', birthday: '11/09/1997',
      note: '',
      orderHistory: [
        { id: '#DH060', date: '15/04/2025', total: 750000, status: 'DELIVERED', items: 2 },
      ]
    },
    {
      id: 8, fullName: 'Bùi Thị Hoa', initials: 'BH',
      email: 'hoa.bui@gmail.com', phone: '0978 901 234',
      totalOrders: 0, totalSpent: 0,
      joinDate: '10/04/2024', status: 'INACTIVE',
      address: '', gender: 'FEMALE', birthday: '',
      note: '',
      orderHistory: []
    },
  ]);

  // ── COMPUTED ───────────────────────────────────
  totalCustomers  = computed(() => this.customers().length);
  activeCustomers = computed(() => this.customers().filter(c => c.status === 'ACTIVE').length);
  totalOrders     = computed(() => this.customers().reduce((s, c) => s + c.totalOrders, 0));
  totalRevenueM   = computed(() => {
    const total = this.customers().reduce((s, c) => s + c.totalSpent, 0);
    return (total / 1000000).toFixed(1);
  });

  filteredCustomers = computed(() => {
    const query  = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    return this.customers().filter(c => {
      const matchStatus = !status || c.status === status;
      const matchSearch = !query
        || c.fullName.toLowerCase().includes(query)
        || c.email.toLowerCase().includes(query)
        || c.phone.includes(query);
      return matchStatus && matchSearch;
    });
  });

  // ── DETAIL MODAL ───────────────────────────────
  openDetail(customer: AdminCustomer): void {
    this.detailCustomer = customer;
  }

  closeDetail(): void {
    this.detailCustomer = null;
  }

  onDetailOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeDetail();
    }
  }

  // ── EDIT DRAWER ────────────────────────────────
  openEdit(customer: AdminCustomer): void {
    this.editingCustomer = customer;
    this.form = {
      fullName: customer.fullName,
      phone:    customer.phone,
      address:  customer.address  || '',
      gender:   customer.gender   || '',
      birthday: customer.birthday || '',
      note:     customer.note     || '',
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
        ? {
          ...c,
          fullName: this.form.fullName,
          phone:    this.form.phone,
          address:  this.form.address,
          gender:   this.form.gender,
          birthday: this.form.birthday,
          note:     this.form.note,
          status:   this.form.status,
        }
        : c
      )
    );
    this.closeDrawer();
  }

  // Mở edit từ modal detail
  openEditFromDetail(): void {
    const customer = this.detailCustomer;
    this.closeDetail();
    if (customer) {
      setTimeout(() => this.openEdit(customer), 100);
    }
  }

  // ── HELPERS ────────────────────────────────────
  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getAvatarColor(index: number): string {
    const colors = ['#3b82f6','#16a34a','#ea580c','#7c3aed','#0891b2','#db2777'];
    return colors[index % colors.length];
  }

  getAvatarColorById(id: number): string {
    return this.getAvatarColor(id - 1);
  }

  getOrderStatusClass(status: string): string {
    const map: Record<string, string> = {
      'DELIVERED': 'badge-green',
      'SHIPPING':  'badge-blue',
      'PENDING':   'badge-yellow',
      'CANCELLED': 'badge-red',
    };
    return map[status] || 'badge-gray';
  }

  getOrderStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'DELIVERED': 'Đã giao',
      'SHIPPING':  'Đang giao',
      'PENDING':   'Chờ xử lý',
      'CANCELLED': 'Đã hủy',
    };
    return map[status] || status;
  }

  getGenderLabel(gender: string): string {
    return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Không xác định';
  }

  isFormValid(): boolean {
    return !!(this.form.fullName && this.form.phone);
  }

  protected readonly Math = Math;
}
