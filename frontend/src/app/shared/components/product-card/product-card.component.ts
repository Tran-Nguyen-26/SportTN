import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/core/models/product/product.model';
import {Router} from "@angular/router";

interface Spec {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: any;
  @Input() specs: Spec[] = [];
  @Output() addToCart = new EventEmitter<any>();
  @Output() addToWishlist = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }

  get name(): string {
    return this.product?.name || '';
  }

  get brand(): string {
    return this.product?.brand || '';
  }

  get newPrice(): number {
    // Support both Product model (discountPrice) and simple data (newPrice)
    return this.product?.newPrice || this.product?.discountPrice || this.product?.price || 0;
  }

  get oldPrice(): number | null {
    // Support both Product model and simple data (oldPrice)
    if (this.product?.oldPrice) return this.product.oldPrice;
    if (this.product?.price && this.product?.discountPrice) {
      return this.product.price;
    }
    return null;
  }

  get rating(): number | undefined {
    return this.product?.rating;
  }

  get reviews(): number | undefined {
    return this.product?.reviews;
  }

  get label(): string {
    // Support explicit label or compute from prices
    if (this.product?.label) return this.product.label;
    if (!this.product?.discountPrice || !this.product?.price) return '';
    const discount = Math.round(((this.product.price - this.product.discountPrice) / this.product.price) * 100);
    return `-${discount}%`;
  }

  get image(): string {
    return this.product?.image || '';
  }

  goToProduct() {
    this.router.navigate(['/product'])
  }
}
