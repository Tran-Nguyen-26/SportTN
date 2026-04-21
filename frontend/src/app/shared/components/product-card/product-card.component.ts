import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router";
import {ProductCardResponse} from "../../../core/models/home-response/home-response";

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
  @Input() product!: ProductCardResponse;
  @Input() specs: Spec[] = [];
  @Output() addToCart = new EventEmitter<any>();
  @Output() addToWishlist = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  goToProduct(): void{
    if (this.product.slug) {
      this.router.navigate(['/product', this.product.slug]);
    }
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
    return this.product?.brandName || '';
  }

  get newPrice(): number {
    // Support both Product model (discountPrice) and simple data (newPrice)
    return this.product?.effectivePrice || this.product?.salePrice || 0;
  }

  get oldPrice(): number | null {
    // Support both Product model and simple data (oldPrice)
    return (this.product?.isOnSale) ? this.product.originalPrice : null;
  }

  get rating(): number | undefined {
    return this.product?.rating;
  }

  get reviews(): number | undefined {
    return this.product?.reviewCount;
  }

  get label(): string {
    // 1. Ưu tiên số % giảm giá nếu sản phẩm đang sale
    if (this.product?.isOnSale && this.product?.discountPercent > 0) {
      return `-${this.product.discountPercent}%`;
    }

    // 2. Nếu không sale thì check xem có phải hàng mới không
    if (this.product?.isNew) {
      return 'MỚI';
    }

    // 3. Cuối cùng là nhãn bán chạy
    if (this.product?.isBestSeller) {
      return 'BÁN CHẠY';
    }

    return ''; // Không có nhãn nào thì để trống
  }

  get image(): string {
    return this.product?.mainImageUrl || '';
  }
}
