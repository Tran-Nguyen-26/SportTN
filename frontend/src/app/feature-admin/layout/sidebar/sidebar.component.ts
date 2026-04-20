import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
}

export interface SidebarGroup {
  groupLabel: string;
  items: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  menuGroups: SidebarGroup[] = [
    {
      groupLabel: 'Overview',
      items: [
        { label: 'Dashboard',   icon: 'dashboard',       route: '/admin' },
        { label: 'Analytics',   icon: 'bar_chart',        route: '/admin/analytics' },
        { label: 'Charts',      icon: 'pie_chart',        route: '/admin/charts' },
      ]
    },
    {
      groupLabel: 'Commerce',
      items: [
        { label: 'Đơn hàng',    icon: 'shopping_bag',     route: '/admin/orders',     badge: 12 },
        { label: 'Sản phẩm',    icon: 'inventory_2',      route: '/admin/products' },
        { label: 'Danh mục',    icon: 'category',         route: '/admin/categories' },
        { label: 'Thương hiệu', icon: 'label',            route: '/admin/brands' },
        { label: 'Khách hàng',  icon: 'people',           route: '/admin/customers' },
        { label: 'Hóa đơn',    icon: 'receipt_long',     route: '/admin/invoices' },
      ]
    },
    {
      groupLabel: 'Marketing',
      items: [
        { label: 'Banners',     icon: 'image',            route: '/admin/banners' },
        { label: 'Vouchers',    icon: 'local_offer',      route: '/admin/vouchers' },
        { label: 'Flash Sale',  icon: 'bolt',             route: '/admin/flash-sale' },
      ]
    },
    {
      groupLabel: 'Kho hàng',
      items: [
        { label: 'Inventory',   icon: 'warehouse',        route: '/admin/inventory' },
      ]
    },
    {
      groupLabel: 'System',
      items: [
        { label: 'Users',       icon: 'manage_accounts',  route: '/admin/users' },
        { label: 'Thông báo',   icon: 'notifications',    route: '/admin/notifications', badge: 3 },
        { label: 'Cài đặt',     icon: 'settings',         route: '/admin/settings' },
      ]
    }
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    if (route === '/admin') {
      return this.router.url === '/admin';
    }
    return this.router.url.startsWith(route);
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
