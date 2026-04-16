import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product/product.model';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading = true;
    // Mock data - Replace with ProductService.getFeaturedProducts()
    setTimeout(() => {
      this.featuredProducts = [
        {
          id: '1',
          name: 'Premium Laptop Backpack',
          description: 'Water-resistant laptop backpack for daily use',
          price: 4999,
          discountPrice: 3499,
          image: 'assets/images/products/laptop-bag.jpg',
          rating: 4.7,
          reviews: 234,
          stock: 25,
          brand: 'SportTech',
          category: { id: 1, name: 'Bags', image: 'assets/images/bags.jpg' }
        },
        {
          id: '2',
          name: 'Professional Running Shoes',
          description: 'High-performance shoes for athletes',
          price: 8999,
          discountPrice: 5999,
          image: 'assets/images/products/running-shoes.jpg',
          rating: 4.8,
          reviews: 567,
          stock: 15,
          brand: 'RunMax',
          category: { id: 1, name: 'Shoes', image: 'assets/images/shoes.jpg' }
        },
        {
          id: '3',
          name: 'Wireless Sports Earbuds',
          description: 'Premium sound quality sports earbuds',
          price: 3999,
          discountPrice: 2499,
          image: 'assets/images/products/earbuds.jpg',
          rating: 4.5,
          reviews: 412,
          stock: 32,
          brand: 'AudioSport',
          category: { id: 3, name: 'Electronics', image: 'assets/images/electronics.jpg' }
        },
        {
          id: '4',
          name: 'Cooling Sports Towel',
          description: 'Quick-dry cooling towel for workouts',
          price: 1499,
          discountPrice: 999,
          image: 'assets/images/products/towel.jpg',
          rating: 4.6,
          reviews: 189,
          stock: 45,
          brand: 'CoolTech',
          category: { id: 4, name: 'Accessories', image: 'assets/images/accessories.jpg' }
        },
        {
          id: '5',
          name: 'Professional Gym Dumbells (Pair)',
          description: 'Adjustable dumbbells for home gym',
          price: 5999,
          discountPrice: 4499,
          image: 'assets/images/products/dumbbells.jpg',
          rating: 4.9,
          reviews: 876,
          stock: 20,
          brand: 'FitGear',
          category: { id: 5, name: 'Equipment', image: 'assets/images/equipment.jpg' }
        },
        {
          id: '6',
          name: 'Compression Sports Socks',
          description: 'Medical-grade compression socks',
          price: 1999,
          discountPrice: 1299,
          image: 'assets/images/products/compression-socks.jpg',
          rating: 4.4,
          reviews: 267,
          stock: 50,
          brand: 'ComfortFit',
          category: { id: 6, name: 'Apparel', image: 'assets/images/apparel.jpg' }
        },
        {
          id: '7',
          name: 'Smart Fitness Watch',
          description: 'Track your fitness with smart watch',
          price: 9999,
          discountPrice: 6999,
          image: 'assets/images/products/smartwatch.jpg',
          rating: 4.7,
          reviews: 523,
          stock: 18,
          brand: 'FitTrack',
          category: { id: 7, name: 'Wearables', image: 'assets/images/wearables.jpg' }
        },
        {
          id: '8',
          name: 'Sport Hydration Belt',
          description: 'Comfortable hydration belt for runners',
          price: 2499,
          discountPrice: 1699,
          image: 'assets/images/products/hydration-belt.jpg',
          rating: 4.3,
          reviews: 145,
          stock: 28,
          brand: 'HydroGear',
          category: { id: 8, name: 'Hydration', image: 'assets/images/hydration.jpg' }
        }
      ];
      this.isLoading = false;
    }, 800);
  }

  addToCart(product: Product): void {
    // TODO: Integrate with CartService
    console.log('Added to cart:', product);
    // Example: this.cartService.addToCart(product);
  }

  addToWishlist(product: Product): void {
    // TODO: Integrate with WishlistService
    console.log('Added to wishlist:', product);
    // Example: this.wishlistService.addToWishlist(product);
  }
}
