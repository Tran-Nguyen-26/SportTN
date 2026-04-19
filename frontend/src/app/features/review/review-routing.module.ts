import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReviewPageComponent} from "./pages/review-page/review-page.component";

const routes: Routes = [
  {
    path: '',
    component: ReviewPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
