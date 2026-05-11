import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayoutComponent} from "./layout/admin-layout/admin-layout.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AnalyticsComponent} from "./pages/analytics/analytics.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {ProductsComponent} from "./pages/products/products.component";
import {CustomersComponent} from "./pages/customers/customers.component";
import {InvoicesComponent} from "./pages/invoices/invoices.component";
import {InventoryComponent} from "./pages/inventory/inventory.component";
import {CategoriesComponent} from "./pages/categories/categories.component";
import {BrandsComponent} from "./pages/brands/brands.component";
import {BannersComponent} from "./pages/banners/banners.component";
import {VouchersComponent} from "./pages/vouchers/vouchers.component";
import {UsersComponent} from "./pages/users/users.component";
import {NotificationsComponent} from "./pages/notifications/notifications.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {adminGuard} from "../core/guards/admin/admin.guard";
import {FlashSaleComponent} from "./pages/flash-sale/flash-sale.component";
import {ChartsComponent} from "./pages/charts/charts.component";
import {ProductPageComponent} from "./components/product-detail/product-page.component";
import { roleGuard } from "../core/guards/role/role.guard";

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'charts',    component: ChartsComponent },

      // ADMIN + SUPER_ADMIN
      {
        path: 'orders', component: OrdersComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] }
      },
      {
        path: 'products', component: ProductsComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE'] }
      },
      {
        path: 'products/add', component: ProductPageComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'products/edit/:id', component: ProductPageComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'products/detail/:id', component: ProductPageComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE'] }
      },
      {
        path: 'customers', component: CustomersComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] }
      },
      {
        path: 'invoices', component: InvoicesComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'inventory', component: InventoryComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE'] }
      },
      {
        path: 'categories', component: CategoriesComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'brands', component: BrandsComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'banners', component: BannersComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'vouchers', component: VouchersComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },
      {
        path: 'flash-sale', component: FlashSaleComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN', 'ADMIN'] }
      },

      {
        path: 'users', component: UsersComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
      {
        path: 'settings', component: SettingsComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
      {
        path: 'notifications', component: NotificationsComponent,
        canActivate: [roleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureAdminRoutingModule { }
