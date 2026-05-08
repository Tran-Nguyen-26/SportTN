import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductReviewComponent } from './components/product-review/product-review.component';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductReviewComponent,
    ProductDescriptionComponent
  ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        MatIconModule,
        SharedModule
    ]
})
export class ProductModule { }
