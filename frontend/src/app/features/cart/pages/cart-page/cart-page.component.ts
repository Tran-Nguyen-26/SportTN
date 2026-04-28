import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { Cart, CartItem } from 'src/app/core/models/cart/cart.model';
import {CouponResult} from "../../components/coupon-input/coupon-input.component";

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
  cart: Cart = { id: '', userId: '', items: [], totalPrice: 0, totalItems: 0 };
  isLoading       = false;
  isEmpty         = true;
  discountPercent = 0;
  selectedPaymentMethodId = 'cod';
  paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng', description: 'Thanh toán tiền mặt khi đơn được giao.' },
    { id: 'banking', label: 'Chuyển khoản ngân hàng', description: 'Chuyển khoản nhanh qua app ngân hàng.' },
    { id: 'ewallet', label: 'Ví điện tử', description: 'Thanh toán qua MoMo / ZaloPay / VNPay.' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;

    // ── Mock data ── Replace with: this.cartService.getCart().subscribe(...)
    setTimeout(() => {
      this.cart = {
        id: 'cart-001',
        userId: 'user-001',
        items: [
          {
            id: 'ci-1',
            product: {
              id: 'p-1',
              name: 'Nike Air Zoom Pegasus 40',
              description: 'Giày chạy bộ chuyên nghiệp đệm phản hồi cao',
              brand: 'Nike',
              image: 'assets/images/products/nike-pegasus.jpg',
              rating: 4.5,
              reviews: 243,
              category: { id: 1, name: 'Giày chạy bộ', image: 'assets/images/categories/shoes.jpg' }
            },
            variant: {
              id: 'v-1-1',
              productId: 'p-1',
              size: '42',
              color: 'Đen/Trắng',
              colorHex: '#1a1a1a',
              image: 'assets/images/products/nike-pegasus-black.jpg',
              originalPrice: 3_200_000,
              salePrice: 2_560_000,
              stock: 8,
              sku: 'NK-PEG40-42-BLK'
            },
            quantity: 1,
            priceSnapshot: 2_560_000
          },
          {
            id: 'ci-2',
            product: {
              id: 'p-2',
              name: 'Adidas Techfit Compression Shirt',
              description: 'Áo thể thao thoáng khí công nghệ AEROREADY',
              brand: 'Adidas',
              image: 'assets/images/products/adidas-shirt.jpg',
              rating: 4.2,
              reviews: 118,
              category: { id: 2, name: 'Áo thể thao', image: 'assets/images/categories/shirts.jpg' }
            },
            variant: {
              id: 'v-2-1',
              productId: 'p-2',
              size: 'L',
              color: 'Xanh Navy',
              colorHex: '#1a237e',
              image: 'assets/images/products/adidas-shirt-navy.jpg',
              originalPrice: 850_000,
              salePrice: 680_000,
              stock: 15,
              sku: 'AD-TECH-L-NVY'
            },
            quantity: 2,
            priceSnapshot: 680_000
          },
          {
            id: 'ci-3',
            product: {
              id: 'p-3',
              name: 'Under Armour UA Rival Fleece Jogger',
              description: 'Quần jogger vải fleece mềm mại giữ nhiệt tốt',
              brand: 'Under Armour',
              image: 'assets/images/products/ua-jogger.jpg',
              rating: 4.4,
              reviews: 76,
              category: { id: 3, name: 'Quần thể thao', image: 'assets/images/categories/pants.jpg' }
            },
            variant: {
              id: 'v-3-1',
              productId: 'p-3',
              size: 'M',
              color: 'Xám',
              colorHex: '#9e9e9e',
              image: 'assets/images/products/ua-jogger-grey.jpg',
              originalPrice: 1_200_000,
              salePrice: 1_200_000,   // không giảm
              stock: 3,
              sku: 'UA-JOG-M-GRY'
            },
            quantity: 1,
            priceSnapshot: 1_200_000
          }
        ],
        totalPrice: 0,
        totalItems: 0
      };

      this.recalculate();
      this.isEmpty   = this.cart.items.length === 0;
      this.isLoading = false;
    }, 600);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.min(Math.max(1, quantity), item.variant.stock);
      this.recalculate();
    }
  }

  removeItem(itemId: string): void {
    this.cart.items = this.cart.items.filter(i => i.id !== itemId);
    this.isEmpty    = this.cart.items.length === 0;
    this.recalculate();
  }

  clearCart(): void {
    this.cart.items = [];
    this.isEmpty    = true;
    this.recalculate();
  }

  recalculate(): void {
    this.cart.totalItems = this.cart.items.reduce((s, i) => s + i.quantity, 0);
    // dùng priceSnapshot — không bị ảnh hưởng bởi thay đổi giá sau này
    this.cart.totalPrice = this.cart.items.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0);
  }

  onCouponApplied(result: CouponResult): void {
    this.discountPercent = result.discountPercent;
  }

  onCouponRemoved(): void {
    this.discountPercent = 0;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    if (this.cart.items.length > 0) {
      this.router.navigate(['/checkout'], {
        queryParams: { paymentMethod: this.selectedPaymentMethodId }
      });
    }
  }

  trackByItemId(_index: number, item: CartItem): string {
    return item.id;
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethodId = methodId;
  }
}
