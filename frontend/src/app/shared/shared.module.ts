import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopBarComponent } from './components/navbar/top-bar/top-bar.component';
import { LogoComponent } from './components/navbar/logo/logo.component';
import { NavActionsComponent } from './components/navbar/nav-actions/nav-actions.component';
import { LocationPickerComponent } from './components/navbar/location-picker/location-picker.component';
import { NavMenuComponent } from './components/navbar/nav-menu/nav-menu.component';
import { NavMenuItemComponent } from './components/navbar/nav-menu-item/nav-menu-item.component';
import { SearchBarComponent } from './components/navbar/search-bar/search-bar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { CategoryBannerComponent } from './components/navbar/category-banner/category-banner.component';

// Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {LoadingSpinnerComponent} from "./components/loading-spinner/loading-spinner.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AddToCartDrawerComponent} from "./components/add-to-cart-drawer/add-to-cart-drawer.component";

const NAVBAR_COMPONENTS = [
  NavbarComponent,
  TopBarComponent,
  LogoComponent,
  SearchBarComponent,
  NavActionsComponent,
  LocationPickerComponent,
  NavMenuComponent,
  NavMenuItemComponent,
  CategoryBannerComponent,
]

const FOOTER_COMPONENTS = [
  FooterComponent
]

const SHARED_COMPONENTS = [
  ProductCardComponent,
  RatingStarsComponent,
  LoadingSpinnerComponent,
  AddToCartDrawerComponent
]

@NgModule({
  declarations: [
    ...NAVBAR_COMPONENTS,
    ...FOOTER_COMPONENTS,
    ...SHARED_COMPONENTS,
  ],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      // Material Modules
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatFormFieldModule,
      MatSelectModule,
      MatMenuModule,
      MatDividerModule,
      MatChipsModule,
      MatBadgeModule,
      MatTooltipModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
  ],
  exports: [
    ...NAVBAR_COMPONENTS,
    ...FOOTER_COMPONENTS,
    ...SHARED_COMPONENTS,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
