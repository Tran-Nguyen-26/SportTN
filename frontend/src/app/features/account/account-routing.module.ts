import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { AddressComponent } from './pages/address/address.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    children: [
      { path: 'my-account', component: MyAccountComponent },
      { path: 'address', component: AddressComponent },
      { path: 'order-history', component: OrderHistoryComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
