import { Component, OnInit } from '@angular/core';

interface FlashSaleProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  stock: number;
  timeLeft: string;
}

@Component({
  selector: 'app-flash-sale-section',
  templateUrl: './flash-sale-section.component.html',
  styleUrls: ['./flash-sale-section.component.css']
})
export class FlashSaleSectionComponent implements OnInit {
  flashSaleProducts: FlashSaleProduct[] = [];
  timeRemaining = {
    hours: 2,
    minutes: 30,
    seconds: 45
  };

  constructor() { }

  ngOnInit(): void {
    this.loadFlashSaleProducts();
    this.startCountdown();
  }

  loadFlashSaleProducts(): void {
    this.flashSaleProducts = [
      {
        id: '1',
        name: 'Nike Running Shoes',
        originalPrice: 7999,
        salePrice: 4999,
        discount: 37,
        image: 'assets/images/products/nike-shoes.jpg',
        stock: 15,
        timeLeft: '2h 30m'
      },
      {
        id: '2',
        name: 'Adidas Sports T-Shirt',
        originalPrice: 2999,
        salePrice: 1599,
        discount: 47,
        image: 'assets/images/products/adidas-shirt.jpg',
        stock: 8,
        timeLeft: '2h 30m'
      },
      {
        id: '3',
        name: 'Puma Shorts',
        originalPrice: 3499,
        salePrice: 1899,
        discount: 46,
        image: 'assets/images/products/puma-shorts.jpg',
        stock: 20,
        timeLeft: '2h 30m'
      },
      {
        id: '4',
        name: 'Decathlon Socks (Pack of 3)',
        originalPrice: 999,
        salePrice: 499,
        discount: 50,
        image: 'assets/images/products/socks.jpg',
        stock: 50,
        timeLeft: '2h 30m'
      },
      {
        id: '5',
        name: 'Sports Water Bottle',
        originalPrice: 1499,
        salePrice: 799,
        discount: 47,
        image: 'assets/images/products/bottle.jpg',
        stock: 30,
        timeLeft: '2h 30m'
      },
      {
        id: '6',
        name: 'Yoga Mat',
        originalPrice: 2499,
        salePrice: 1299,
        discount: 48,
        image: 'assets/images/products/yoga-mat.jpg',
        stock: 12,
        timeLeft: '2h 30m'
      }
    ];
  }

  startCountdown(): void {
    setInterval(() => {
      if (this.timeRemaining.seconds > 0) {
        this.timeRemaining.seconds--;
      } else if (this.timeRemaining.minutes > 0) {
        this.timeRemaining.minutes--;
        this.timeRemaining.seconds = 59;
      } else if (this.timeRemaining.hours > 0) {
        this.timeRemaining.hours--;
        this.timeRemaining.minutes = 59;
        this.timeRemaining.seconds = 59;
      }
    }, 1000);
  }

  getTimeString(): string {
    return `${this.pad(this.timeRemaining.hours)}:${this.pad(this.timeRemaining.minutes)}:${this.pad(this.timeRemaining.seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  addToCart(product: FlashSaleProduct): void {
    // Implement add to cart logic
  }
}
