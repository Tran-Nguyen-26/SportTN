import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CartItem } from 'src/app/core/models/cart/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  animations: [
    trigger('itemSlide', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out')
      ]),
      transition(':leave', [
        animate('160ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output() itemRemoved     = new EventEmitter<string>();

  increaseQuantity(): void {
    if (this.item.quantity < this.item.variant.stock) {
      this.quantityChanged.emit({ itemId: this.item.id, quantity: this.item.quantity + 1 });
    }
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChanged.emit({ itemId: this.item.id, quantity: this.item.quantity - 1 });
    }
  }

  remove(): void {
    this.itemRemoved.emit(this.item.id);
  }

  /** Tổng tiền = priceSnapshot (giá tại thời điểm thêm) x quantity */
  getTotalPrice(): number {
    return this.item.priceSnapshot * this.item.quantity;
  }

  /** Tiết kiệm so với giá gốc của variant */
  getSavings(): number {
    return (this.item.variant.originalPrice - this.item.priceSnapshot) * this.item.quantity;
  }

  /** Phần trăm giảm (làm tròn) */
  getSavingsPercent(): number {
    if (this.item.variant.originalPrice === 0) return 0;
    return Math.round(
      ((this.item.variant.originalPrice - this.item.priceSnapshot) / this.item.variant.originalPrice) * 100
    );
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder-product.png';
  }
}
