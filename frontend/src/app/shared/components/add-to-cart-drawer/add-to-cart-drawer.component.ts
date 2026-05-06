import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface SizeOption {
  value: string;
  label: string;
  available: boolean;
}

export interface CartItem {
  productId: string | number;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  size: string;
  quantity: number;
}

export interface DrawerProduct {
  id: string | number;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  discountPercent?: number;
  sizes?: SizeOption[];
  maxQuantity?: number;
}

@Component({
  selector: 'app-add-to-cart-drawer',
  templateUrl: './add-to-cart-drawer.component.html',
  styleUrls: ['./add-to-cart-drawer.component.css'],
})
export class AddToCartDrawerComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() product: DrawerProduct | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() addedToCart = new EventEmitter<CartItem>();

  selectedSize = '';
  quantity = 1;
  sizeError = false;
  addSuccess = false;

  defaultSizes: SizeOption[] = [
    { value: 'XS', label: 'XS', available: true },
    { value: 'S',  label: 'S',  available: true },
    { value: 'M',  label: 'M',  available: true },
    { value: 'L',  label: 'L',  available: false },
    { value: 'XL', label: 'XL', available: true },
    { value: 'XXL',label: 'XXL',available: true },
  ];

  get sizes(): SizeOption[] {
    return this.product?.sizes ?? this.defaultSizes;
  }

  get displayPrice(): number {
    return this.product?.price ?? 0;
  }

  get displayOriginalPrice(): number | null {
    return this.product?.isOnSale && this.product?.originalPrice
      ? this.product.originalPrice
      : null;
  }

  get maxQty(): number {
    return this.product?.maxQuantity ?? 10;
  }

  ngOnInit(): void {
    this.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.reset();
      document.body.style.overflow = 'hidden';
    } else if (changes['isOpen']?.currentValue === false) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) this.close();
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('drawer-backdrop')) {
      this.close();
    }
  }

  selectSize(size: SizeOption): void {
    if (!size.available) return;
    this.selectedSize = size.value;
    this.sizeError = false;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty(): void {
    if (this.quantity < this.maxQty) this.quantity++;
  }

  onQtyInput(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 1 && val <= this.maxQty) {
      this.quantity = val;
    }
  }

  addToCart(): void {
    if (!this.selectedSize) {
      this.sizeError = true;
      const sizeSection = document.querySelector('.size-section');
      sizeSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!this.product) return;

    const item: CartItem = {
      productId: this.product.id,
      name: this.product.name,
      brand: this.product.brand,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
      originalPrice: this.product.originalPrice,
      size: this.selectedSize,
      quantity: this.quantity,
    };

    this.addedToCart.emit(item);
    this.addSuccess = true;

    setTimeout(() => {
      this.addSuccess = false;
      this.close();
    }, 900);
  }

  private reset(): void {
    this.selectedSize = '';
    this.quantity = 1;
    this.sizeError = false;
    this.addSuccess = false;
  }
}
