import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from 'src/app/core/models/cart/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output() itemRemoved = new EventEmitter<string>();

  increaseQuantity(): void {
    this.quantityChanged.emit({ itemId: this.item.id, quantity: this.item.quantity + 1 });
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChanged.emit({ itemId: this.item.id, quantity: this.item.quantity - 1 });
    }
  }

  remove(): void {
    this.itemRemoved.emit(this.item.id);
  }

  getTotalPrice(): number {
    return this.item.price * this.item.quantity;
  }

  getSavings(): number {
    const originalPrice = this.item.product.price || this.item.price;
    return (originalPrice - this.item.price) * this.item.quantity;
  }
}
