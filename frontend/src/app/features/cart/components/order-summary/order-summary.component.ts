import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartResponse } from "../../../../core/services/cart/cart.service";

const FREE_SHIP_THRESHOLD = 500_000;
const SHIPPING_FEE        = 30_000;
const TAX_RATE            = 0.10;

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  animations: [
    trigger('rowFade', [
      transition(':enter', [
        style({ opacity: 0, height: 0, marginBottom: 0 }),
        animate('180ms ease-out', style({ opacity: 1, height: '*', marginBottom: '*' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, height: 0, marginBottom: 0 }))
      ])
    ])
  ]
})
export class OrderSummaryComponent {
  cartSignal = signal<CartResponse | null>(null);
  discountPercentSignal = signal<number>(0);

  @Input() set cart(value: CartResponse) {
    this.cartSignal.set(value);
  }

  @Input() set discountPercent(value: number) {
    this.discountPercentSignal.set(value);
  }

  @Output() checkout = new EventEmitter<void>();


  subtotal = computed(() => this.cartSignal()?.total || 0);

  discountAmount = computed(() => {
    // Giả định discountPercent truyền vào dạng số nguyên (ví dụ: 10 cho 10%)
    return Math.round(this.subtotal() * (this.discountPercentSignal() / 100));
  });

  // Thuế tính trên giá sau giảm
  tax = computed(() => {
    const afterDiscount = this.subtotal() - this.discountAmount();
    return Math.round(afterDiscount * TAX_RATE);
  });

  // Phí vận chuyển
  shipping = computed(() => {
    const s = this.subtotal();
    if (s === 0) return 0;
    return s >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  });

  // Tổng thanh toán cuối cùng
  total = computed(() => {
    return (this.subtotal() - this.discountAmount()) + this.tax() + this.shipping();
  });

  // Logic Free Ship Progress
  freeShipGap = computed(() => Math.max(0, FREE_SHIP_THRESHOLD - this.subtotal()));

  freeShipProgress = computed(() =>
    Math.min(100, Math.round((this.subtotal() / FREE_SHIP_THRESHOLD) * 100))
  );

  proceedCheckout(): void {
    const currentCart = this.cartSignal();
    if (currentCart && currentCart.cartItems && currentCart.cartItems.length > 0) {
      this.checkout.emit();
    }
  }
}
