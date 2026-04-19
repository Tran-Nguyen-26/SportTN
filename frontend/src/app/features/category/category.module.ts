import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { ColorFilterComponent } from './components/filters/color-filter/color-filter.component';
import { PriceFilterComponent } from './components/filters/price-filter/price-filter.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FilterSectionComponent } from './components/filters/filter-section/filter-section.component'


@NgModule({
  declarations: [
    CategoryPageComponent,
    FilterSidebarComponent,
    ColorFilterComponent,
    PriceFilterComponent,
    ProductGridComponent,
    FilterSectionComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CategoryModule { }
