import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewPageComponent } from './pages/review-page/review-page.component';


@NgModule({
  declarations: [
    ReviewPageComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule
  ]
})
export class ReviewModule { }
