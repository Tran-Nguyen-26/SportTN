import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from "../../../core/services/auth/auth.service";

export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  roles?: string[];
}

export interface SidebarGroup {
  groupLabel: string;
  items: SidebarItem[];
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  activeLabel = 'Dashboard';
  visibleGroups$!: Observable<SidebarGroup[]>;

  private readonly menuGroups: SidebarGroup[] = [
    {
      groupLabel: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin' }
      ]
    },
    {
      groupLabel: 'Commerce',
      items: [
        {
          label: 'Đơn hàng', icon: 'shopping_bag', route: '/admin/orders', badge: 12,
          roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF']
        },
        {
          label: 'Sản phẩm', icon: 'inventory_2', route: '/admin/products',
          roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE']
        },
        {
          label: 'Danh mục', icon: 'category', route: '/admin/categories',
          roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
          label: 'Thương hiệu', icon: 'label', route: '/admin/brands',
          roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
          label: 'Khách hàng', icon: 'people', route: '/admin/customers',
          roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF']
        },
        {
          label: 'Hóa đơn', icon: 'receipt_long', route: '/admin/invoices',
          roles: ['SUPER_ADMIN', 'ADMIN']
        },
      ]
    },
    {
      groupLabel: 'Marketing',
      items: [
        {
          label: 'Banners', icon: 'image', route: '/admin/banners',
          roles: ['SUPER_ADMIN', 'ADMIN']
        },
      ]
    },
    {
      groupLabel: 'System',
      roles: ['SUPER_ADMIN'],
      items: [
        {
          label: 'Users', icon: 'manage_accounts', route: '/admin/users',
          roles: ['SUPER_ADMIN']
        },
        {
          label: 'Cài đặt', icon: 'settings', route: '/admin/settings',
          roles: ['SUPER_ADMIN']
        },
      ]
    }
  ];

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.visibleGroups$ = this.authService.currentUser$.pipe(
      map(auth => {
        const role = auth?.userResponse?.role;
        if (!role) return [];
        return this.menuGroups
          .filter(group => !group.roles || group.roles.includes(role))
          .map(group => ({
            ...group,
            items: group.items.filter(item => !item.roles || item.roles.includes(role))
          }))
          .filter(group => group.items.length > 0);
      })
    );
  }

  isActive(route: string): boolean {
    if (route === '/admin') {
      return this.router.url === '/admin';
    }
    return this.router.url.startsWith(route);
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onItemClick(label: string): void {
    this.activeLabel = label;
  }
}
