import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Cart } from 'src/app/core/models/cart/cart.model';

const FREE_SHIP_THRESHOLD = 500_000; // VND
const SHIPPING_FEE        = 30_000;  // VND
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
export class OrderSummaryComponent implements OnChanges {
  @Input() cart!: Cart;
  /** Discount percent (0–1) emitted by CouponInputComponent */
  @Input() discountPercent = 0;
  @Output() checkout = new EventEmitter<void>();

  subtotal = 0;
  discount = 0;
  tax      = 0;
  shipping = 0;
  total    = 0;
  freeShipGap      = 0;
  freeShipProgress = 0;

  ngOnChanges(_changes: SimpleChanges): void {
    this.calculateSummary();
  }

  calculateSummary(): void {
    if (!this.cart) return;

    this.subtotal = this.cart.totalPrice;
    this.discount = Math.round(this.subtotal * this.discountPercent);

    const afterDiscount = this.subtotal - this.discount;
    this.tax      = Math.round(afterDiscount * TAX_RATE);
    this.shipping = this.subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    this.total    = afterDiscount + this.tax + this.shipping;

    // Free-ship progress
    this.freeShipGap      = Math.max(0, FREE_SHIP_THRESHOLD - this.subtotal);
    this.freeShipProgress = Math.min(100, Math.round((this.subtotal / FREE_SHIP_THRESHOLD) * 100));
  }

  proceedCheckout(): void {
    if (this.cart.items.length > 0) {
      this.checkout.emit();
    }
  }
}
