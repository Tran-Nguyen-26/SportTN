import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, Cart } from 'src/app/core/models/cart/cart.model';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cart: Cart = {
    id: '',
    userId: '',
    items: [],
    totalPrice: 0,
    totalItems: 0
  };
  isLoading = false;
  isEmpty = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    // Mock data for UI - Replace with CartService.getCart()
    this.cart = {
      id: '1',
      userId: '1',
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Nike Sports Shoes',
            description: 'High-quality sports shoes',
            price: 150,
            discountPrice: 120,
            image: 'assets/images/products/shoes.jpg',
            rating: 4.5,
            reviews: 120,
            stock: 10,
            brand: 'Nike',
            category: { id: 1, name: 'Shoes', image: 'assets/images/shoes.jpg' }
          },
          quantity: 1,
          price: 120
        },
        {
          id: '2',
          product: {
            id: '2',
            name: 'Adidas Sports Shirt',
            description: 'Comfortable sports shirt',
            price: 60,
            discountPrice: 50,
            image: 'assets/images/products/shirt.jpg',
            rating: 4.2,
            reviews: 85,
            stock: 15,
            brand: 'Adidas',
            category: { id: 2, name: 'Shirts', image: 'assets/images/shirts.jpg' }
          },
          quantity: 2,
          price: 100
        }
      ],
      totalPrice: 220,
      totalItems: 3
    };
    this.isEmpty = this.cart.items.length === 0;
    this.isLoading = false;
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.recalculateCart();
    }
  }

  removeItem(itemId: string): void {
    this.cart.items = this.cart.items.filter(i => i.id !== itemId);
    this.recalculateCart();
    this.isEmpty = this.cart.items.length === 0;
  }

  recalculateCart(): void {
    this.cart.totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  proceedToCheckout(): void {
    if (this.cart.items.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
