import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CartItemResponse } from "../../../../core/services/cart/cart.service";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  animations: [
    trigger('itemSlide', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('240ms ease-out')
      ]),
      transition(':leave', [
        animate('160ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class CartItemComponent {
  itemSignal = signal<CartItemResponse | null>(null);

  @Input() set item(value: CartItemResponse) {
    this.itemSignal.set(value);
  }

  @Output() quantityChanged = new EventEmitter<{ itemId: number; currentQty: number; delta: number }>();
  @Output() itemRemoved = new EventEmitter<number>();

  // --- 2. Computed Signals để tối ưu tính toán ---

  savings = computed(() => {
    const item = this.itemSignal();
    if (!item) return 0;
    const v = item.variant;
    if (v.salePrice && v.salePrice < v.originalPrice) {
      return (v.originalPrice - v.salePrice) * item.quantity;
    }
    return 0;
  });

  savingsPercent = computed(() => {
    const item = this.itemSignal();
    if (!item) return 0;
    const v = item.variant;
    if (!v.originalPrice || v.originalPrice === 0 || !v.salePrice) return 0;
    return Math.round(((v.originalPrice - v.salePrice) / v.originalPrice) * 100);
  });

  totalPrice = computed(() => this.itemSignal()?.subTotal || 0);

  originalTotal = computed(() => {
    const item = this.itemSignal();
    return item ? item.variant.originalPrice * item.quantity : 0;
  });

  increaseQuantity(): void {
    const item = this.itemSignal();
    if (item && item.quantity < item.variant.stockQuantity) {
      this.quantityChanged.emit({ itemId: item.cartItemId, currentQty: item.quantity, delta: 1 });
    }
  }

  decreaseQuantity(): void {
    const item = this.itemSignal();
    if (item && item.quantity > 1) {
      this.quantityChanged.emit({ itemId: item.cartItemId, currentQty: item.quantity, delta: -1 });
    }
  }

  remove(): void {
    const item = this.itemSignal();
    if (item) {
      console.log('Emit item ID:', item.cartItemId);
      this.itemRemoved.emit(item.cartItemId);
    }
  }

  // onImageError(event: Event): void {
  //   (event.target as HTMLImageElement).src = 'assets/images/placeholder-product.png';
  // }

  displayImage = computed(() => {
    const item = this.itemSignal();
    return item?.variant?.mainImageUrl || 'assets/images/placeholder-product.png';
  });
}
