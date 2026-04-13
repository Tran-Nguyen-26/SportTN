import { Component, Input } from '@angular/core';

export interface ProductCategory {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() category!: ProductCategory;
}
