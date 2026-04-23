import { Component } from '@angular/core';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'WAREHOUSE';

export interface ActivityLog {
  type: 'create' | 'edit' | 'delete' | 'login' | 'order';
  action: string;
  time: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  active: boolean;
  lastLogin: string;
  createdAt: string;
  avatarColor: string;
  isCurrentUser?: boolean;
  actionCount: number;
  device: string;
  activityLog: ActivityLog[];
}

export interface UserForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole | '';
  permissions: string[];
  active: boolean;
}

export interface Permission {
  value: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  searchQuery   = '';
  selectedRole  = '';
  selectedStatus = '';
  drawerVisible = false;
  showPassword  = false;
  editingUser: AdminUser | null = null;
  detailUser: AdminUser | null = null;

  form: UserForm = this.emptyForm();

  roleOptions = [
    { value: '',            label: 'Tất cả vai trò'    },
    { value: 'SUPER_ADMIN', label: 'Super Admin'        },
    { value: 'ADMIN',       label: 'Admin'              },
    { value: 'STAFF',       label: 'Nhân viên'          },
    { value: 'WAREHOUSE',   label: 'Thủ kho'            },
  ];

  roleDefinitions = [
    {
      value: 'SUPER_ADMIN' as UserRole,
      label: 'Super Admin',
      icon: 'security',
      desc: 'Toàn quyền hệ thống, không thể bị giới hạn',
    },
    {
      value: 'ADMIN' as UserRole,
      label: 'Admin',
      icon: 'admin_panel_settings',
      desc: 'Quản lý sản phẩm, đơn hàng, khách hàng',
    },
    {
      value: 'STAFF' as UserRole,
      label: 'Nhân viên',
      icon: 'support_agent',
      desc: 'Xử lý đơn hàng, hỗ trợ khách hàng',
    },
    {
      value: 'WAREHOUSE' as UserRole,
      label: 'Thủ kho',
      icon: 'warehouse',
      desc: 'Quản lý tồn kho, nhập xuất hàng',
    },
  ];

  allPermissions: Permission[] = [
    { value: 'VIEW_DASHBOARD',  label: 'Xem Dashboard',    desc: 'Xem tổng quan và báo cáo' },
    { value: 'MANAGE_PRODUCTS', label: 'Quản lý sản phẩm', desc: 'Thêm, sửa, xóa sản phẩm & danh mục' },
    { value: 'MANAGE_ORDERS',   label: 'Quản lý đơn hàng', desc: 'Xem, xử lý, hủy đơn hàng' },
    { value: 'MANAGE_CUSTOMERS',label: 'Quản lý khách hàng',desc: 'Xem và chỉnh sửa thông tin KH' },
    { value: 'MANAGE_INVENTORY',label: 'Quản lý tồn kho',  desc: 'Nhập/xuất kho, cập nhật số lượng' },
    { value: 'MANAGE_VOUCHERS', label: 'Quản lý voucher',  desc: 'Tạo, sửa, xóa mã giảm giá' },
    { value: 'MANAGE_BANNERS',  label: 'Quản lý banner',   desc: 'Cập nhật hình ảnh trang chủ' },
    { value: 'MANAGE_FLASH_SALE',label: 'Flash Sale',      desc: 'Tạo và quản lý flash sale' },
    { value: 'VIEW_ANALYTICS',  label: 'Xem Analytics',    desc: 'Báo cáo doanh thu chi tiết' },
    { value: 'MANAGE_USERS',    label: 'Quản lý Users',    desc: 'Tạo và phân quyền tài khoản' },
    { value: 'SEND_NOTIFS',     label: 'Gửi thông báo',    desc: 'Push notification đến khách hàng' },
    { value: 'MANAGE_SETTINGS', label: 'Cài đặt hệ thống', desc: 'Thông tin cửa hàng, cấu hình' },
  ];

  // Preset permissions theo role
  private rolePermissions: Record<UserRole, string[]> = {
    SUPER_ADMIN: this.allPermissions.map(p => p.value),
    ADMIN: [
      'VIEW_DASHBOARD','MANAGE_PRODUCTS','MANAGE_ORDERS',
      'MANAGE_CUSTOMERS','MANAGE_VOUCHERS','MANAGE_BANNERS',
      'MANAGE_FLASH_SALE','VIEW_ANALYTICS','SEND_NOTIFS',
    ],
    STAFF: [
      'VIEW_DASHBOARD','MANAGE_ORDERS','MANAGE_CUSTOMERS',
    ],
    WAREHOUSE: [
      'VIEW_DASHBOARD','MANAGE_INVENTORY','MANAGE_PRODUCTS',
    ],
  };

  users: AdminUser[] = [
    {
      id: 1, name: 'Trần Minh Tuấn', email: 'tuan.admin@sport.vn',
      phone: '0901 234 567', role: 'SUPER_ADMIN',
      permissions: this.rolePermissions['SUPER_ADMIN'],
      active: true, lastLogin: '18/07/2025 14:30', createdAt: '01/01/2024',
      avatarColor: '#7c3aed', isCurrentUser: true,
      actionCount: 2480, device: 'Chrome · MacOS',
      activityLog: [
        { type: 'edit',   action: 'Cập nhật banner trang chủ',           time: '14:28 hôm nay' },
        { type: 'order',  action: 'Xác nhận đơn hàng #10284',            time: '14:10 hôm nay' },
        { type: 'create', action: 'Tạo flash sale "Đồ Bơi Mùa Hè"',     time: '09:42 hôm nay' },
        { type: 'edit',   action: 'Cập nhật giá sản phẩm #45',           time: 'Hôm qua 16:20'  },
        { type: 'login',  action: 'Đăng nhập thành công',                time: 'Hôm qua 08:05'  },
      ],
    },
    {
      id: 2, name: 'Nguyễn Thị Hoa', email: 'hoa.staff@sport.vn',
      phone: '0912 345 678', role: 'ADMIN',
      permissions: this.rolePermissions['ADMIN'],
      active: true, lastLogin: '18/07/2025 09:15', createdAt: '15/03/2024',
      avatarColor: '#2563eb',
      actionCount: 1240, device: 'Firefox · Windows',
      activityLog: [
        { type: 'order',  action: 'Xử lý đơn hàng #10282',              time: '09:20 hôm nay' },
        { type: 'edit',   action: 'Sửa thông tin sản phẩm Kính Bơi TYR', time: '09:05 hôm nay' },
        { type: 'create', action: 'Thêm voucher SUMMER25',               time: 'Hôm qua 14:30'  },
        { type: 'login',  action: 'Đăng nhập thành công',                time: 'Hôm qua 08:00'  },
      ],
    },
    {
      id: 3, name: 'Lê Văn Khánh', email: 'khanh.staff@sport.vn',
      phone: '0923 456 789', role: 'STAFF',
      permissions: this.rolePermissions['STAFF'],
      active: true, lastLogin: '17/07/2025 17:45', createdAt: '01/05/2024',
      avatarColor: '#16a34a',
      actionCount: 520, device: 'Chrome · Windows',
      activityLog: [
        { type: 'order',  action: 'Xác nhận 8 đơn hàng',                time: 'Hôm qua 17:40'  },
        { type: 'order',  action: 'Hủy đơn hàng #10270 theo yêu cầu',   time: 'Hôm qua 15:10'  },
        { type: 'login',  action: 'Đăng nhập thành công',                time: 'Hôm qua 08:00'  },
      ],
    },
    {
      id: 4, name: 'Phạm Thị Thu', email: 'thu.warehouse@sport.vn',
      phone: '0934 567 890', role: 'WAREHOUSE',
      permissions: this.rolePermissions['WAREHOUSE'],
      active: true, lastLogin: '18/07/2025 07:30', createdAt: '10/06/2024',
      avatarColor: '#ea580c',
      actionCount: 380, device: 'Chrome · Android',
      activityLog: [
        { type: 'create', action: 'Nhập kho 200 Mũ Bơi Speedo',         time: '07:35 hôm nay' },
        { type: 'edit',   action: 'Cập nhật tồn kho 12 SKU',            time: 'Hôm qua 16:00'  },
        { type: 'login',  action: 'Đăng nhập thành công',                time: 'Hôm qua 07:00'  },
      ],
    },
    {
      id: 5, name: 'Hoàng Đức Nam', email: 'nam.admin@sport.vn',
      phone: '0945 678 901', role: 'ADMIN',
      permissions: ['VIEW_DASHBOARD','MANAGE_PRODUCTS','VIEW_ANALYTICS'],
      active: false, lastLogin: '01/06/2025 10:00', createdAt: '20/02/2024',
      avatarColor: '#0891b2',
      actionCount: 890, device: 'Safari · iPhone',
      activityLog: [
        { type: 'login',  action: 'Đăng nhập thành công',  time: '01/06 10:00' },
        { type: 'edit',   action: 'Chỉnh sửa danh mục',    time: '31/05 14:20' },
      ],
    },
  ];

  // ── Computed ────────────────────────────────
  activeCount() { return this.users.filter(u => u.active).length; }

  getRoleCount(role: string) {
    return this.users.filter(u => u.role === role).length;
  }

  get filteredUsers(): AdminUser[] {
    return this.users.filter(u => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q);
      const matchR = !this.selectedRole || u.role === this.selectedRole;
      const matchS = !this.selectedStatus || u.active.toString() === this.selectedStatus;
      return matchQ && matchR && matchS;
    });
  }

  // ── Role helpers ─────────────────────────────
  getRoleIcon(role: UserRole): string {
    const map: Record<UserRole, string> = {
      SUPER_ADMIN: 'security',
      ADMIN:       'admin_panel_settings',
      STAFF:       'support_agent',
      WAREHOUSE:   'warehouse',
    };
    return map[role] ?? 'person';
  }

  getRoleLabel(role: UserRole): string {
    const map: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN:       'Admin',
      STAFF:       'Nhân viên',
      WAREHOUSE:   'Thủ kho',
    };
    return map[role] ?? role;
  }

  getPermShort(perm: string): string {
    const map: Record<string, string> = {
      VIEW_DASHBOARD:   'Dashboard',
      MANAGE_PRODUCTS:  'Sản phẩm',
      MANAGE_ORDERS:    'Đơn hàng',
      MANAGE_CUSTOMERS: 'KH',
      MANAGE_INVENTORY: 'Kho',
      MANAGE_VOUCHERS:  'Voucher',
      MANAGE_BANNERS:   'Banner',
      MANAGE_FLASH_SALE:'Flash',
      VIEW_ANALYTICS:   'Analytics',
      MANAGE_USERS:     'Users',
      SEND_NOTIFS:      'Notif',
      MANAGE_SETTINGS:  'Settings',
    };
    return map[perm] ?? perm;
  }

  getLogIcon(type: string): string {
    const map: Record<string, string> = {
      create: 'add_circle',
      edit:   'edit',
      delete: 'delete',
      login:  'login',
      order:  'shopping_bag',
    };
    return map[type] ?? 'circle';
  }

  // ── Drawer ────────────────────────────────────
  openDrawer(user?: AdminUser): void {
    if (user) {
      this.editingUser = user;
      this.form = {
        name:        user.name,
        email:       user.email,
        password:    '',
        phone:       user.phone,
        role:        user.role,
        permissions: [...user.permissions],
        active:      user.active,
      };
    } else {
      this.editingUser = null;
      this.form = this.emptyForm();
    }
    this.showPassword  = false;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.editingUser   = null;
    this.form          = this.emptyForm();
    this.showPassword  = false;
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  isFormValid(): boolean {
    const base = !!(this.form.name && this.form.email && this.form.role);
    if (!this.editingUser) return base && this.form.password.length >= 8;
    return base;
  }

  selectRole(role: UserRole): void {
    this.form.role        = role;
    this.form.permissions = [...(this.rolePermissions[role] || [])];
  }

  togglePerm(perm: string): void {
    const idx = this.form.permissions.indexOf(perm);
    if (idx >= 0) {
      this.form.permissions.splice(idx, 1);
    } else {
      this.form.permissions.push(perm);
    }
  }

  save(): void {
    if (!this.isFormValid()) return;
    if (this.editingUser) {
      Object.assign(this.editingUser, {
        name:        this.form.name,
        phone:       this.form.phone,
        role:        this.form.role as UserRole,
        permissions: [...this.form.permissions],
        active:      this.form.active,
      });
    } else {
      this.users.push({
        id:          Date.now(),
        name:        this.form.name,
        email:       this.form.email,
        phone:       this.form.phone,
        role:        this.form.role as UserRole,
        permissions: [...this.form.permissions],
        active:      this.form.active,
        lastLogin:   '',
        createdAt:   new Date().toLocaleDateString('vi-VN'),
        avatarColor: this.randomColor(),
        actionCount: 0,
        device:      '',
        activityLog: [],
      });
    }
    this.closeDrawer();
  }

  toggleUserStatus(user: AdminUser): void {
    if (user.isCurrentUser) return;
    user.active = !user.active;
  }

  // ── Detail modal ─────────────────────────────
  openDetail(user: AdminUser): void {
    this.detailUser    = user;
    this.drawerVisible = false;
  }

  onDetailOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.detailUser = null;
    }
  }

  openDrawerFromDetail(): void {
    const u = this.detailUser;
    this.detailUser = null;
    if (u) this.openDrawer(u);
  }

  // ── Helpers ──────────────────────────────────
  private randomColor(): string {
    const colors = ['#2563eb','#7c3aed','#16a34a','#ea580c','#0891b2','#d97706','#dc2626'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private emptyForm(): UserForm {
    return {
      name: '', email: '', password: '', phone: '',
      role: '', permissions: [], active: true,
    };
  }
}
