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
import {ChartCardComponent} from "./components/chart-card/chart-card.component";
import {FlashSaleComponent} from "./pages/flash-sale/flash-sale.component";

// feature-admin-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '',             redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',    component: DashboardComponent    },
      { path: 'analytics',    component: AnalyticsComponent    },
      { path: 'charts', component: ChartCardComponent },
      { path: 'orders',       component: OrdersComponent       },
      { path: 'products',     component: ProductsComponent     },
      { path: 'customers',    component: CustomersComponent    },
      { path: 'invoices',     component: InvoicesComponent     },
      { path: 'inventory',    component: InventoryComponent    },
      { path: 'categories',   component: CategoriesComponent   },
      { path: 'brands',       component: BrandsComponent       },
      { path: 'banners',      component: BannersComponent      },
      { path: 'vouchers',     component: VouchersComponent     },
      { path: 'flash-sale', component: FlashSaleComponent},
      { path: 'users',        component: UsersComponent        },
      { path: 'notifications',component: NotificationsComponent},
      { path: 'settings',     component: SettingsComponent     },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureAdminRoutingModule { }
