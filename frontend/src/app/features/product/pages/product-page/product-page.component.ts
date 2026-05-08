import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductPageResponse, VariantResponse} from "../../../../core/models/product/product.model";
import {ImageResponse} from "../../../../core/models/image";
import {ProductService} from "../../../../core/services/product/product.service";
import {AddToCartRequest, CartService} from "../../../../core/services/cart/cart.service";


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  productId!: number;
  productSlug!: string;
  isLoading = true;
  productDetail: ProductPageResponse | null = null;

  // ── Image gallery ────────────────────────────────────────────────
  activeImage = '';

  get allImages(): ImageResponse[] {
    return this.productDetail?.productImageResponses ?? [];
  }

  setActiveImage(url: string): void {
    this.activeImage = url;
  }

  // ── Variant selection ────────────────────────────────────────────
  selectedColor = '';
  selectedSize  = '';
  quantity      = 1;

  get availableColors(): string[] {
    const variants = this.productDetail?.variantResponses ?? [];
    return [...new Set(variants.map(v => v.color))];
  }

  get availableSizes(): string[] {
    const variants = this.productDetail?.variantResponses ?? [];
    // Nếu đã chọn màu → chỉ hiện size của màu đó
    const filtered = this.selectedColor
      ? variants.filter(v => v.color === this.selectedColor)
      : variants;
    return [...new Set(filtered.map(v => v.size))];
  }

  isSizeAvailable(size: string): boolean {
    const variants = this.productDetail?.variantResponses ?? [];
    return variants.some(
      v => v.size === size
        && (!this.selectedColor || v.color === this.selectedColor)
        && v.stockQuantity > 0
    );
  }

  get selectedVariant(): VariantResponse | null {
    if (!this.selectedColor || !this.selectedSize) return null;
    return this.productDetail?.variantResponses.find(
      v => v.color === this.selectedColor && v.size === this.selectedSize
    ) ?? null;
  }

  get effectivePrice(): number {
    if (this.selectedVariant) {
      return this.selectedVariant.salePrice || this.selectedVariant.originalPrice;
    }
    // Fallback: giá thấp nhất
    return this.productDetail?.productCardResponse.effectivePrice ?? 0;
  }

  get discountPercent(): number {
    if (!this.selectedVariant?.salePrice || !this.selectedVariant.originalPrice) return 0;
    if (this.selectedVariant.salePrice >= this.selectedVariant.originalPrice) return 0;
    return Math.round(
      (this.selectedVariant.originalPrice - this.selectedVariant.salePrice)
      / this.selectedVariant.originalPrice * 100
    );
  }

  get maxQty(): number {
    return this.selectedVariant?.stockQuantity ?? 10;
  }

  get canAddToCart(): boolean {
    return !!(this.selectedVariant && this.selectedVariant.stockQuantity > 0);
  }

  get totalReviewCount(): number {
    return this.productDetail?.productCardResponse.reviewCount ?? 0;
  }

  // ── Wishlist ─────────────────────────────────────────────────────
  isWishlisted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    // private wishlistService: WishlistService // TODO: inject khi có service
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.router.navigate(['/']); return; }
    this.productSlug = slug;
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductBySlug(this.productSlug).subscribe({
      next: (res) => {
        if (res.data) {
          this.productDetail = res.data;
          this.activeImage = res.data.productImageResponses[0]?.imageUrl
            ?? res.data.productCardResponse.mainImageUrl
            ?? '';
          if (this.availableColors.length === 1) {
            this.selectedColor = this.availableColors[0];
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ProductPage] Lỗi tải sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Actions ──────────────────────────────────────────────────────

  selectColor(color: string): void {
    this.selectedColor = color;
    this.selectedSize  = '';
    this.quantity      = 1;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.quantity     = 1;
  }

  changeQty(delta: number): void {
    this.quantity = Math.max(1, Math.min(this.maxQty, this.quantity + delta));
  }

  addToCart(): void {
    if (!this.canAddToCart || !this.selectedVariant) {
      alert('Vui lòng chọn màu sắc và kích cỡ!');
      return;
    }

    const request: AddToCartRequest = {
      variantId: this.selectedVariant.id,
      quantity: this.quantity
    };

    this.cartService.addItemToCart(request).subscribe({
      next: (res) => {
        console.log('[ProductPage] Thêm vào giỏ hàng thành công:', res);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ProductPage] Lỗi thêm vào giỏ:', err);
        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        this.isLoading = false;
      }
    })
    console.log('[ProductPage] Thêm vào giỏ:', {
      variantId: this.selectedVariant.id,
      quantity:  this.quantity
    });
  }

  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
    // TODO: this.wishlistService.toggle(this.productId)
    console.log('[ProductPage] Wishlist:', this.isWishlisted);
  }
}
