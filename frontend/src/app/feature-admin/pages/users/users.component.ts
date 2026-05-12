import {Component, computed, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import {
  UserService,
  AdminUserCreateRequest,
  AdminUserUpdateRequest,
  PermissionOption
} from '../../../core/services/user/user.service';
import {AuthService} from "../../../core/services/auth/auth.service";

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'WAREHOUSE';

export interface ActivityLog {
  type: 'create' | 'edit' | 'delete' | 'login' | 'order';
  action: string;
  time: Date;
}

export interface AdminUser {
  id: number;
  username: string;
  fullname: string;
  email: string;
  lastDevice: string;
  phone: string;
  role: UserRole;
  permissions: PermissionOption[];
  status: string;
  lastLogin: string;
  createdAt: string;
  avatarColor: string;
  isCurrentUser?: boolean;
  actionCount: number;
  device: string;
  activityLog: ActivityLog[];
}

export interface UserForm {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole | '';
  permissions: string[];
  status: string;
}

export interface Permission {
  id: number;
  value: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchQuery    = '';
  selectedRole   = '';
  selectedStatus = '';
  drawerVisible  = false;
  showPassword   = false;
  isSaving       = false;
  isLoading      = false;

  editingUser: AdminUser | null = null;
  detailUser:  AdminUser | null = null;

  form: UserForm = this.emptyForm();

  roleOptions = [
    { value: '',            label: 'Tất cả vai trò' },
    { value: 'SUPER_ADMIN', label: 'Super Admin'     },
    { value: 'ADMIN',       label: 'Admin'           },
    { value: 'STAFF',       label: 'Nhân viên'       },
    { value: 'WAREHOUSE',   label: 'Thủ kho'         },
  ];

  roleDefinitions = [
    { value: 'SUPER_ADMIN' as UserRole, label: 'Super Admin', icon: 'security',
      desc: 'Toàn quyền hệ thống, không thể bị giới hạn' },
    { value: 'ADMIN' as UserRole, label: 'Admin', icon: 'admin_panel_settings',
      desc: 'Quản lý sản phẩm, đơn hàng, khách hàng' },
    { value: 'STAFF' as UserRole, label: 'Nhân viên', icon: 'support_agent',
      desc: 'Xử lý đơn hàng, hỗ trợ khách hàng' },
    { value: 'WAREHOUSE' as UserRole, label: 'Thủ kho', icon: 'warehouse',
      desc: 'Quản lý tồn kho, nhập xuất hàng' },
  ];

  allPermissions: Permission[] = [];

  private rolePermissions: Record<UserRole, string[]> = {
    SUPER_ADMIN: [], // sẽ fill sau khi load permissions
    ADMIN: [
      'VIEW_DASHBOARD','MANAGE_PRODUCTS','MANAGE_ORDERS',
      'MANAGE_CUSTOMERS','MANAGE_VOUCHERS','MANAGE_BANNERS',
      'MANAGE_FLASH_SALE','VIEW_ANALYTICS','SEND_NOTIFS',
    ],
    STAFF:     ['VIEW_DASHBOARD','MANAGE_ORDERS','MANAGE_CUSTOMERS'],
    WAREHOUSE: ['VIEW_DASHBOARD','MANAGE_INVENTORY','MANAGE_PRODUCTS'],
  };

  users = signal<AdminUser[]>([]);

  constructor(
    private router: Router,
    private userService: UserService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.loadAdminUsers();
  }

  // ── Load permissions từ DB ────────────────────────────────────────

  loadPermissions(): void {
    this.userService.getPermissions().subscribe({
      next: (res) => {
        if (res.data) {
          this.allPermissions = res.data.map(p => ({
            id: p.id,
            value: p.name,
            label: p.value,
            desc:  p.description ?? '',
          }));
          // SUPER_ADMIN có tất cả permissions
          this.rolePermissions.SUPER_ADMIN = this.allPermissions.map(p => p.value);
          console.log('[Users] Permissions loaded:', this.allPermissions.length);
        }
      },
      error: (err) => console.error('[Users] Lỗi tải permissions:', err)
    });
  }

  // ── Load users ────────────────────────────────────────────────────

  loadAdminUsers(): void {
    this.isLoading = true;
    this.userService.getAdminUsers().subscribe({
      next: (res) => {
        if (res.data) {
          this.users.set(res.data);
          console.log('[Users] Danh sách admin:', res.data);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[Users] Lỗi tải danh sách:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Computed ──────────────────────────────────────────────────────

  adminTotalCount = computed(() => this.users().length);
  activeCount(): number { return this.users().filter(u => u.status).length; }

  getRoleCount(role: string): number {
    return this.users().filter(u => u.role === role).length;
  }

  get filteredUsers(): AdminUser[] {
    return this.users().filter(u => {
      const q      = this.searchQuery.toLowerCase();
      const matchQ = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchR = !this.selectedRole   || u.role === this.selectedRole;
      const matchS = !this.selectedStatus || u.status.toString() === this.selectedStatus;
      return matchQ && matchR && matchS;
    });
  }

  // ── Role / Permission helpers ─────────────────────────────────────

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
      VIEW_DASHBOARD:   'Dashboard', MANAGE_PRODUCTS:  'Sản phẩm',
      MANAGE_ORDERS:    'Đơn hàng',  MANAGE_CUSTOMERS: 'KH',
      MANAGE_INVENTORY: 'Kho',       MANAGE_VOUCHERS:  'Voucher',
      MANAGE_BANNERS:   'Banner',    MANAGE_FLASH_SALE: 'Flash',
      VIEW_ANALYTICS:   'Analytics', MANAGE_USERS:     'Users',
      SEND_NOTIFS:      'Notif',     MANAGE_SETTINGS:  'Settings',
    };
    return map[perm] ?? perm;
  }

  hasPermission(user: AdminUser | null, permValue: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p =>
      (p as any).name === permValue ||
      (p as any).code === permValue ||
      (p as any).value === permValue
    );
  }

  getLogIcon(type: string): string {
    const map: Record<string, string> = {
      create: 'add_circle', edit: 'edit', delete: 'delete',
      login:  'login',      order: 'shopping_bag',
    };
    return map[type] ?? 'circle';
  }

  // ── Drawer ────────────────────────────────────────────────────────

  openDrawer(user?: AdminUser): void {
    if (user) {
      this.editingUser = user;
      this.form = {
        fullname: user.fullname,
        username:        user.username,
        email:       user.email,
        password:    '',
        phone:       user.phone,
        role:        user.role,
        permissions: user.permissions.map(p => (p as any).value || (p as any).name ||''),
        status:      user.status,
      };
    } else {
      this.editingUser = null;
      this.form        = this.emptyForm();
    }
    this.showPassword  = false;
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.editingUser   = null;
    this.form          = this.emptyForm();
    this.showPassword  = false;
    this.isSaving      = false;
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  isFormValid(): boolean {
    const base = !!(this.form.username && this.form.email && this.form.role);
    if (!this.editingUser) return base && this.form.password.length >= 8;
    return base;
  }

  selectRole(role: UserRole): void {
    this.form.role        = role;
    this.form.permissions = [...(this.rolePermissions[role] || [])];
  }

  togglePerm(perm: string): void {
    const idx = this.form.permissions.indexOf(perm);
    if (idx >= 0) this.form.permissions.splice(idx, 1);
    else          this.form.permissions.push(perm);
  }

  // ── Save (create / update) ────────────────────────────────────────

  save(): void {
    if (!this.isFormValid()) return;
    this.isSaving = true;

    if (this.editingUser) {
      const request: AdminUserUpdateRequest = {
        fullname: this.form.fullname,
        username:        this.form.username,
        phone:       this.form.phone,
        role:        this.form.role as UserRole,
        permissions: [...this.form.permissions],
        status:      this.form.status,
      };

      this.userService.updateAdminUser(this.editingUser.id, request).subscribe({
        next: (res) => {
          if (res.data) {
            this.users.update(list =>
              list.map(u => u.id === res.data!.id ? { ...u, ...res.data! } : u)
            );
          }
          this.isSaving = false;
          this.closeDrawer();
        },
        error: (err) => {
          console.error('[Users] Lỗi cập nhật:', err);
          this.isSaving = false;
        }
      });

    } else {
      // CREATE
      const request: AdminUserCreateRequest = {
        fullname: this.form.fullname,
        username:        this.form.username,
        email:       this.form.email,
        password:    this.form.password,
        phone:       this.form.phone,
        role:        this.form.role as UserRole,
        permissions: [...this.form.permissions],
        status:      this.form.status,
      };

      this.userService.createAdminUser(request).subscribe({
        next: (res) => {
          if (res.data) {
            this.users.update(list => [res.data!, ...list]);
          }
          this.isSaving = false;
          this.closeDrawer();
        },
        error: (err) => {
          console.error('[Users] Lỗi tạo user:', err);
          this.isSaving = false;
        }
      });
    }
  }

  // ── Toggle status ─────────────────────────────────────────────────

  toggleUserStatus(user: AdminUser): void {
    if (user.isCurrentUser) return;

    this.userService.toggleAdminUserStatus(user.id, !user.status).subscribe({
      next: (res) => {
        if (res.data) {
          this.users.update(list =>
            list.map(u => u.id === user.id ? { ...u, active: res.data!.status } : u)
          );
        }
      },
      error: (err) => console.error('[Users] Lỗi toggle status:', err)
    });
  }

  toggleStatus() {
    if (this.form.status === 'ACTIVE') {
      this.form.status = 'INACTIVE';
    } else {
      this.form.status = 'ACTIVE';
    }
  }


  // ── Delete ────────────────────────────────────────────────────────

  deleteUser(user: AdminUser): void {
    if (user.isCurrentUser) return;
    if (!confirm(`Xóa tài khoản "${user.username}"? Hành động này không thể hoàn tác.`)) return;

    this.userService.deleteAdminUser(user.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== user.id));
      },
      error: (err) => console.error('[Users] Lỗi xóa user:', err)
    });
  }

  // ── Detail modal ──────────────────────────────────────────────────

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

  usersLength = computed(() => this.users().length);

  // ── Helpers ───────────────────────────────────────────────────────

  private randomColor(): string {
    const colors = ['#2563eb','#7c3aed','#16a34a','#ea580c','#0891b2','#d97706','#dc2626'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private emptyForm(): UserForm {
    return {
      fullname: '', username: '', email: '', password: '', phone: '',
      role: '', permissions: [], status: 'ACTIVE',
    };
  }
}
