import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { AddressComponent } from './pages/address/address.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import {authGuard} from "../../core/guards/auth/auth.guard";
import {WishlistComponent} from "./pages/wishlist/wishlist.component";
import {NotificationComponent} from "./pages/notification/notification.component";
import {SupportCenterComponent} from "./pages/support-center/support-center.component";
import {WalletComponent} from "./pages/wallet/wallet.component";

const routes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    canActivate: [authGuard],
    children: [
      { path: 'my-account', component: MyAccountComponent },
      { path: 'address', component: AddressComponent },
      { path: 'order-history', component: OrderHistoryComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'help', component: SupportCenterComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
