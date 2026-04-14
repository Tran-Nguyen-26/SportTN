import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AddressComponent } from './pages/address/address.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';


@NgModule({
  declarations: [
    AddressComponent,
    OrderHistoryComponent,
    WalletComponent,
    MyAccountComponent,
    AccountMenuComponent,
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
