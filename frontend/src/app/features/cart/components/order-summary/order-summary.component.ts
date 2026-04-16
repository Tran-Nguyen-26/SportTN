import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cart } from 'src/app/core/models/cart/cart.model';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  @Input() cart!: Cart;
  @Output() checkout = new EventEmitter<void>();

  subtotal: number = 0;
  discount: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;

  ngOnInit(): void {
    this.calculateSummary();
  }

  ngOnChanges(): void {
    this.calculateSummary();
  }

  calculateSummary(): void {
    if (this.cart) {
      this.subtotal = this.cart.totalPrice;
      // Mock calculations - Replace with actual business logic
      this.discount = this.subtotal * 0.05; // 5% discount
      this.tax = this.subtotal * 0.18; // 18% tax
      this.shipping = this.subtotal > 500 ? 0 : 100; // Free shipping above 500
      this.total = this.subtotal - this.discount + this.tax + this.shipping;
    }
  }

  proceedCheckout(): void {
    this.checkout.emit();
  }
}
