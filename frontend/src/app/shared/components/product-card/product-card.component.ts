import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardResponse } from '../../../core/models/home-response/home-response';
// import {CartItem} from "../../../core/models/cart/cart.model";
import {CartItem, DrawerProduct} from "../add-to-cart-drawer/add-to-cart-drawer.component";

interface Spec { icon: string; text: string; }

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: ProductCardResponse;
  @Input() specs: Spec[] = [];
  @Output() addToCart     = new EventEmitter<ProductCardResponse>();
  @Output() addToWishlist = new EventEmitter<ProductCardResponse>();

  wishlisted = false;
  drawerOpen = false;
  selectedProduct: DrawerProduct | null = null;

  constructor(private router: Router) {}

  goToProduct(): void {
    if (this.product?.slug) this.router.navigate(['/product', this.product.slug]);
  }

  onAddToCart(): void { this.addToCart.emit(this.product); }

  toggleWish(e: Event): void {
    e.stopPropagation();
    this.wishlisted = !this.wishlisted;
    this.addToWishlist.emit(this.product);
  }

  isSaleBadge(): boolean {
    return !!this.label && this.label.startsWith('-');
  }

  get name(): string    { return this.product?.name ?? ''; }
  get brand(): string   { return this.product?.brandName ?? ''; }
  get image(): string   { return this.product?.mainImageUrl ?? ''; }
  get rating(): number | undefined  { return this.product?.rating; }
  get reviews(): number | undefined { return this.product?.reviewCount; }

  get newPrice(): number {
    return this.product?.effectivePrice || this.product?.salePrice || 0;
  }

  get oldPrice(): number | null {
    return this.product?.isOnSale ? this.product.originalPrice : null;
  }

  get label(): string {
    if (this.product?.isOnSale && this.product?.discountPercent > 0)
      return `-${this.product.discountPercent}%`;
    if (this.product?.isNew)        return 'MỚI';
    if (this.product?.isBestSeller) return 'BÁN CHẠY';
    return '';
  }


  openDrawer(product: ProductCardResponse) {
    this.selectedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brandName,
      imageUrl: product.mainImageUrl,
      price: product.effectivePrice,
      originalPrice: product.originalPrice,
      isOnSale: product.isOnSale,
    };
    this.drawerOpen = true;
  }

  onAddedToCart(item: CartItem) {
    // gọi CartService.add(item)
  }
}
