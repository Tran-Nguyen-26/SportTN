import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { BrandFilterComponent } from './components/filters/brand-filter/brand-filter.component';
import { ColorFilterComponent } from './components/filters/color-filter/color-filter.component';
import { GenderFilterComponent } from './components/filters/gender-filter/gender-filter.component';
import { PriceFilterComponent } from './components/filters/price-filter/price-filter.component';
import { TypeFilterComponent } from './components/filters/type-filter/type-filter.component';
import { SizeFilterComponent } from './components/filters/size-filter/size-filter.component';
import { SportFilterComponent } from './components/filters/sport-filter/sport-filter.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module'


@NgModule({
  declarations: [
    CategoryPageComponent,
    FilterSidebarComponent,
    BrandFilterComponent,
    ColorFilterComponent,
    GenderFilterComponent,
    PriceFilterComponent,
    TypeFilterComponent,
    SizeFilterComponent,
    SportFilterComponent,
    ProductGridComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CategoryModule { }
