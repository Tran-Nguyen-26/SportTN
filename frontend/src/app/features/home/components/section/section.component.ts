import { Component, Input } from '@angular/core';
import {
  BannerResponse,
  CategoryResponse,
  ProductCardResponse
} from "../../../../core/models/home-response/home-response";

// interface Banner {
//   title: string;
//   image: string;
// }
//
// interface Product {
//   name: string;
//   brand: string;
//   newPrice: number;
//   oldPrice?: number | null;
//   rating?: number;
//   reviews?: number;
//   label?: string;
//   image: string;
// }

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  @Input() title!: string;
  @Input() banners: BannerResponse[] = [];
  @Input() childrenCategories: CategoryResponse[] = [];
  @Input() products: ProductCardResponse[] = [];
}
