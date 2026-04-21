import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductReviewComponent } from './components/product-review/product-review.component';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductDetailComponent,
    ProductReviewComponent,
    ProductDescriptionComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MatIconModule
  ]
})
export class ProductModule { }
