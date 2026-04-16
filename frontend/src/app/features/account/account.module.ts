import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { AddressComponent } from './pages/address/address.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

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
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
  ]
})
export class AccountModule { }
