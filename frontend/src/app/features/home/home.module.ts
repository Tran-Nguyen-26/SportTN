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
import { MostSearchedComponent } from './components/most-searched/most-searched.component';
import { SportsPopularComponent } from './components/sports-popular/sports-popular.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { CheapQualityComponent } from './components/cheap-quality/cheap-quality.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SectionComponent } from './components/section/section.component';
import { ServicesComponent } from './components/services/services.component';

// Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryChildrenComponent } from './components/category-children/category-children.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';

@NgModule({
  declarations: [
    HomePageComponent,
    HeroBannerComponent,
    ValueBarComponent,
    CategoryCirclesComponent,
    FlashSaleSectionComponent,
    FeaturedProductsComponent,
    PromoBannerComponent,
    MostSearchedComponent,
    SportsPopularComponent,
    BestSellerComponent,
    CheapQualityComponent,
    SectionComponent,
    ServicesComponent,
    CategoryChildrenComponent,
    CompanyInfoComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class HomeModule { }
