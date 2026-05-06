import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureAdminRoutingModule } from './feature-admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductsComponent } from './pages/products/products.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { BannersComponent } from './pages/banners/banners.component';
import { VouchersComponent } from './pages/vouchers/vouchers.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import { FlashSaleComponent } from './pages/flash-sale/flash-sale.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import {SharedModule} from "../shared/shared.module";
import {AddCategoryDrawerComponent} from "./components/add-category-drawer/add-category-drawer.component";
import {ProductDetailComponent} from "./components/product-detail/product-detail.component";


@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    AnalyticsComponent,
    OrdersComponent,
    ProductsComponent,
    CustomersComponent,
    InvoicesComponent,
    InventoryComponent,
    CategoriesComponent,
    BrandsComponent,
    BannersComponent,
    VouchersComponent,
    UsersComponent,
    SettingsComponent,
    NotificationsComponent,
    StatsCardComponent,
    DataTableComponent,
    PageHeaderComponent,
    ConfirmDialogComponent,
    StatusBadgeComponent,
    FlashSaleComponent,
    AddProductComponent,
    ChartsComponent,
    OrderModalComponent,
    AddCategoryDrawerComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    FeatureAdminRoutingModule,
    FormsModule,
    MatIconModule,
    SharedModule
  ]
})
export class FeatureAdminModule { }
