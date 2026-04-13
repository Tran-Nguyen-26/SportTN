import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopBarComponent } from './components/navbar/top-bar/top-bar.component';
import { LogoComponent } from './components/navbar/logo/logo.component';
import { NavActionsComponent } from './components/navbar/nav-actions/nav-actions.component';
import { LocationPickerComponent } from './components/navbar/location-picker/location-picker.component';
import { NavMenuComponent } from './components/navbar/nav-menu/nav-menu.component';
import { NavMenuItemComponent } from './components/navbar/nav-menu-item/nav-menu-item.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './components/navbar/search-bar/search-bar.component';
import { MatIconModule } from '@angular/material/icon'
import { ProductCardComponent } from './components/product-card/product-card.component';

const NAVBAR_COMPONENTS = [
  NavbarComponent,
  TopBarComponent,
  LogoComponent,
  SearchBarComponent,
  NavActionsComponent,
  LocationPickerComponent,
  NavMenuComponent,
  NavMenuItemComponent,
  ProductCardComponent
]

const FOOTER_COMPONENTS = [
  FooterComponent
]

@NgModule({
  declarations: [
    ...NAVBAR_COMPONENTS,
    ...FOOTER_COMPONENTS
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    MatIconModule
  ],
  exports: [
    ...NAVBAR_COMPONENTS,
    ...FOOTER_COMPONENTS
  ]
})
export class SharedModule { }
