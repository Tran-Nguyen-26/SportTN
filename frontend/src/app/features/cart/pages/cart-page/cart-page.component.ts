import {Component, computed, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartService, CartResponse, CartItemResponse } from 'src/app/core/services/cart/cart.service'; // Cập nhật đường dẫn thực tế
import { CouponResult } from "../../components/coupon-input/coupon-input.component";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('240ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CartPageComponent implements OnInit {
  // Cập nhật kiểu dữ liệu theo CartResponse mới
  cart = signal<CartResponse | null>(null);

  isLoading = false;
  isEmpty = true;
  discountPercent = signal(0);
  selectedPaymentMethodId = 'cod';

  paymentMethods = [
    {id: 'cod', label: 'Thanh toán khi nhận hàng', description: 'Thanh toán tiền mặt khi đơn được giao.'},
    {id: 'banking', label: 'Chuyển khoản ngân hàng', description: 'Chuyển khoản nhanh qua app ngân hàng.'},
    {id: 'ewallet', label: 'Ví điện tử', description: 'Thanh toán qua MoMo / ZaloPay / VNPay.'}
  ];

  constructor(
    private router: Router,
    private cartService: CartService // Inject CartService
  ) {
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.data) {
          this.cart.set(res.data);
          const currentCart = this.cart();
          this.isEmpty = !currentCart || !currentCart.cartItems || currentCart.cartItems.length === 0;
          console.log("Thông tin giỏ hàng: ", res.data);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải giỏ hàng:', err);
        this.isLoading = false;
        this.isEmpty = true;
      }
    });
  }

  updateQuantity(event: { itemId: number; currentQty: number; delta: number }): void {
    const newQty = event.currentQty + event.delta;
    if (newQty < 1) return;

    const currentCart = this.cart();

    const item = currentCart?.cartItems?.find(i => i.id === event.itemId);

    if (item && newQty > item.variant.stockQuantity) {
      alert(`Rất tiếc, sản phẩm này chỉ còn ${item.variant.stockQuantity} món.`);
      return;
    }

    this.isLoading = true;
    // this.cartService.updateQuantity(event.itemId, newQty).subscribe({
    //   next: (res) => {
    //     // Vì trong Service bạn đã dùng tap() để set signal,
    //     // nên giao diện sẽ tự động cập nhật ở đây.
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Lỗi cập nhật số lượng:', err);
    //     this.isLoading = false;
    //   }
    // });
  }

  removeItem(cartItemId: number): void {
    // if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    //   this.isLoading = true;
    //   this.cartService.removeItem(cartItemId).subscribe({
    //     next: () => this.loadCart(),
    //     error: () => (this.isLoading = false)
    //   });
    // }
  }

  totalItemsCount = computed(() => {
    const currentCart = this.cart(); // Lắng nghe sự thay đổi của cart signal
    if (!currentCart || !currentCart.cartItems) return 0;

    return currentCart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  });

  finalTotal = computed(() => {
    const total = this.cart()?.total || 0;
    const discount = this.discountPercent();
    return total * (1 - discount / 100);
  });

  onCouponApplied(result: CouponResult): void {
    this.discountPercent.set(result.discountPercent);
  }

  onCouponRemoved(): void {
    this.discountPercent.set(0);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    const currentCart = this.cart();
    if (currentCart && currentCart.cartItems.length > 0) {
      this.router.navigate(['/checkout'], {
        queryParams: {paymentMethod: this.selectedPaymentMethodId}
      });
    }
  }

  trackByItemId(_index: number, item: CartItemResponse): number {
    return item.id;
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethodId = methodId;
  }

  clearCart(): void {
    //   if (confirm('Xóa toàn bộ giỏ hàng?')) {
    //     this.isLoading = true;
    //     // Giả sử bạn có api clear giỏ hàng, nếu không thì lặp qua list để xóa
    //     this.cartService.clearCart().subscribe({
    //       next: () => this.loadCart(),
    //       error: () => (this.isLoading = false)
    //     });
    //   }
    // }
  }
}
