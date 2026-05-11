import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  signal,
} from '@angular/core';
import { ProductService } from '../../../core/services/product/product.service';
import { VariantResponse } from '../../../core/models/product/product.model';
import { ProductCardResponse } from '../../../core/models/home-response/home-response';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth/auth.service";

export interface CartItem {
  productId: number;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string; // Thêm color vào cart item
  quantity: number;
  variantId: number;
}

@Component({
  selector: 'app-add-to-cart-drawer',
  templateUrl: './add-to-cart-drawer.component.html',
  styleUrls: ['./add-to-cart-drawer.component.css'],
})
export class AddToCartDrawerComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() product: ProductCardResponse | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() addedToCart = new EventEmitter<CartItem>();

  selectedColor = '';
  selectedSize = '';
  quantity = 1;

  selectionError = '';
  addSuccess = false;
  variants = signal<VariantResponse[]>([]);

  constructor(
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  isLoggedIn$ = this.authService.isLoggedIn$;

  get availableColors(): string[] {
    return [...new Set(this.variants().map((v) => v.color))];
  }

  get availableSizes(): string[] {
    const v = this.variants();
    const filtered = this.selectedColor
      ? v.filter((variant) => variant.color === this.selectedColor)
      : v;
    return [...new Set(filtered.map((s) => s.size))];
  }

  isSizeDisabled(size: string): boolean {
    const v = this.variants();
    return !v.some(
      (variant) =>
        variant.size === size &&
        (!this.selectedColor || variant.color === this.selectedColor) &&
        variant.stockQuantity > 0
    );
  }

  get selectedVariant(): VariantResponse | null {
    if (!this.selectedColor || !this.selectedSize) return null;
    return (
      this.variants().find(
        (v) => v.color === this.selectedColor && v.size === this.selectedSize
      ) ?? null
    );
  }

  get displayPrice(): number {
    if (this.selectedVariant) {
      return this.selectedVariant.salePrice || this.selectedVariant.originalPrice;
    }
    return this.product?.effectivePrice ?? 0;
  }

  get maxQty(): number {
    return this.selectedVariant?.stockQuantity ?? 10;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    if (this.product?.id) this.loadVariants(this.product.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']?.currentValue) {
      this.loadVariants(changes['product'].currentValue.id);
    }
    if (changes['isOpen']?.currentValue === true) {
      this.reset();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  loadVariants(productId: number): void {
    this.productService.getProductVariantsByProductId(productId).subscribe({
      next: (res) => {
        if (res.data) {
          this.variants.set(res.data);
          // Tự động chọn màu nếu chỉ có 1 lựa chọn
          const colors = [...new Set(res.data.map((v: any) => v.color))];
          if (colors.length === 1) this.selectedColor = colors[0];
        }
      },
    });
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.selectedSize = '';
    this.selectionError = '';
  }

  selectSize(size: string): void {
    if (this.isSizeDisabled(size)) return;
    this.selectedSize = size;
    this.selectionError = '';
  }

  changeQty(delta: number): void {
    this.quantity = Math.max(1, Math.min(this.maxQty, this.quantity + delta));
  }

  addToCart(): void {
    if (!this.selectedColor || !this.selectedSize) {
      this.selectionError = 'Vui lòng chọn Màu sắc và Kích cỡ';
      return;
    }

    if (!this.selectedVariant || !this.product) return;

    const item: CartItem = {
      productId: this.product.id,
      name: this.product.name,
      brand: this.product.brandName,
      imageUrl: this.product.mainImageUrl,
      price: this.displayPrice,
      originalPrice: this.selectedVariant.originalPrice,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
      variantId: this.selectedVariant.id,
    };

    this.addedToCart.emit(item);
    this.addSuccess = true;
    setTimeout(() => this.close(), 800);
  }

  close(): void {
    this.closed.emit();
  }

  private reset(): void {
    this.selectedSize = '';
    this.selectedColor = '';
    this.quantity = 1;
    this.selectionError = '';
    this.addSuccess = false;
    const colors = this.availableColors;
    if (colors.length === 1) this.selectedColor = colors[0];
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void { if (this.isOpen) this.close(); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('drawer-backdrop')) {
      this.close();
    }
  }

  get displayOriginalPrice(): number | null {
    if (this.selectedVariant) {
      return this.selectedVariant.salePrice ? this.selectedVariant.originalPrice : null;
    }

    if (this.product?.isOnSale) {
      return this.product.originalPrice ?? null;
    }
    return null;
  }

  goToLogin() {
    this.close();
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: window.location.pathname }
    });
  }
}
