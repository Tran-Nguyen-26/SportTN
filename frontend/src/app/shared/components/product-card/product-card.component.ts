import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() name!: string;
  @Input() brand!: string;
  @Input() newPrice!: number;
  @Input() oldPrice?: number | null = null;
  @Input() rating?: number;
  @Input() reviews?: number;
  @Input() label?: string;
  @Input() image!: string;
}
