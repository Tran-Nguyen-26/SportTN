import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardResponse } from '../../../core/models/home-response/home-response';
import { CartItem } from '../add-to-cart-drawer/add-to-cart-drawer.component';

interface Spec {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: ProductCardResponse;
  @Input() specs: Spec[] = [];

  @Output() addToCart     = new EventEmitter<ProductCardResponse>();
  @Output() addToWishlist = new EventEmitter<ProductCardResponse>();

  wishlisted  = false;
  drawerOpen  = false;

  drawerProduct: ProductCardResponse | null = null;

  constructor(private router: Router) {}

  // ── Navigation ─────────────────────────────────────────────────────────────

  goToProduct(): void {
    if (this.product?.slug) {
      this.router.navigate(['/product', this.product.slug]);
    }
  }

  // ── Cart / Wishlist ────────────────────────────────────────────────────────

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.openDrawer();
  }

  onAddedToCart(item: CartItem): void {
    // TODO: gọi CartService.add(item)
    console.log('Thêm vào giỏ:', item);
    // Nếu cần emit lên parent:
    // this.addToCart.emit(this.product);
  }

  toggleWish(e: Event): void {
    e.stopPropagation();
    this.wishlisted = !this.wishlisted;
    this.addToWishlist.emit(this.product);
  }

  // ── Drawer helpers ─────────────────────────────────────────────────────────

  openDrawer(): void {
    this.drawerProduct = this.product;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
  }

  // ── Computed getters ───────────────────────────────────────────────────────

  isSaleBadge(): boolean {
    return !!this.label && this.label.startsWith('-');
  }

  get name(): string   { return this.product?.name        ?? ''; }
  get brand(): string  { return this.product?.brandName   ?? ''; }
  get image(): string  { return this.product?.mainImageUrl ?? ''; }

  get rating(): number | undefined  { return this.product?.rating; }
  get reviews(): number | undefined { return this.product?.reviewCount; }

  get newPrice(): number {
    return this.product?.effectivePrice || this.product?.salePrice || 0;
  }

  get oldPrice(): number | null {
    return this.product?.isOnSale ? (this.product.originalPrice ?? null) : null;
  }

  get label(): string {
    if (this.product?.isOnSale && this.product?.discountPercent > 0)
      return `-${this.product.discountPercent}%`;
    if (this.product?.isNew)        return 'MỚI';
    if (this.product?.isBestSeller) return 'BÁN CHẠY';
    return '';
  }
}
