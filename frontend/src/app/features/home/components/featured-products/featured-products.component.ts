import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product/product.model';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: ProductCardResponse[] = [];
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
          id: 101,
          name: 'Kính bơi Ready xám',
          slug: '',
          description: '',
          mainImageUrl: 'assets/kinhboi.jpg', // Tên trường mới
          brandName: 'DECATHLON',             // Tên trường mới
          rating: 4.5,
          reviewCount: 115,                   // Tên trường mới
          soldCount: 500,                     // Thêm trường số lượng đã bán
          originalPrice: 100000,              // Giá gốc (số)
          salePrice: 69000,                   // Giá đang giảm
          effectivePrice: 69000,              // Giá thực tế cuối cùng
          discountPercent: 31,                // % giảm giá
          isOnSale: true,                     // Trạng thái giảm giá
          isNew: true,                        // Trạng thái hàng mới
          isBestSeller: false                 // Trạng thái bán chạy
        }
      ];
      this.isLoading = false;
    }, 800);
  }

  addToCart(product: ProductCardResponse): void {
    // TODO: Integrate with CartService
    console.log('Added to cart:', product);
    // Example: this.cartService.addToCart(product);
  }

  addToWishlist(product: ProductCardResponse): void {
    // TODO: Integrate with WishlistService
    console.log('Added to wishlist:', product);
    // Example: this.wishlistService.addToWishlist(product);
  }
}
