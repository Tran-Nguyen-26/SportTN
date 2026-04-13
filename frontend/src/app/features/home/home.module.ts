import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { ValueBarComponent } from './components/value-bar/value-bar.component';
import { CategoryCirclesComponent } from './components/category-circles/category-circles.component';
import { FlashSaleSectionComponent } from './components/flash-sale-section/flash-sale-section.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';


@NgModule({
  declarations: [
    HomePageComponent,
    HeroBannerComponent,
    ValueBarComponent,
    CategoryCirclesComponent,
    FlashSaleSectionComponent,
    FeaturedProductsComponent,
    PromoBannerComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
