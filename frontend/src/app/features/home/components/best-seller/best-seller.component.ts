import { Component } from '@angular/core';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent {
  products = [
    { 
      name: 'Mũ lưỡi trai du lịch HIKE 100 xanh đen', 
      newPrice: 59000, 
      oldPrice: null, 
      brand: 'FORCLAZ', 
      rating: 4.8, 
      reviews: 12342, 
      label: 'SẢN PHẨM MỚI', 
      image: 'assets/mu.jpg' 
    },
    { 
      name: 'Gói 3 đôi tất chạy bộ Run 100 - Đen', 
      newPrice: 79000, 
      oldPrice: 99000, 
      brand: 'KIPRUN', 
      rating: 4.7, 
      reviews: 24716, 
      label: 'GIÁ CŨ 99K', 
      image: 'assets/tat.jpg' 
    },
    { 
      name: 'Balo đi ngoại tiện dụng 10L - Arpenaz 50 be', 
      newPrice: 69000, 
      oldPrice: null, 
      brand: 'QUECHUA', 
      rating: 4.8, 
      reviews: 23316, 
      label: 'SẢN PHẨM MỚI', 
      image: 'assets/balo.jpg' 
    },
    { 
      name: 'Áo thun chạy bộ nam thoáng khí - 100 Dry đen', 
      newPrice: 99000, 
      oldPrice: null, 
      brand: 'DECATHLON', 
      rating: 4.7, 
      reviews: 25202, 
      label: 'BÁN CHẠY', 
      image: 'assets/aothun.jpg' 
    },
    { 
      name: 'Kính bơi cận một cỡ tròng kính trong suốt', 
      newPrice: 129000, 
      oldPrice: 199000, 
      brand: 'DECATHLON', 
      rating: 4.7, 
      reviews: 1740, 
      label: 'GIÁ CŨ 199K', 
      image: 'assets/kinhboi1.jpg' 
    },
    { 
      name: 'Kính bơi tròng kính trong suốt - Ready xám', 
      newPrice: 69000, 
      oldPrice: null, 
      brand: 'DECATHLON', 
      rating: 4.5, 
      reviews: 115, 
      label: 'SẢN PHẨM MỚI', 
      image: 'assets/kinhboi2.jpg' 
    },
    { 
      name: 'Gậy leo núi dã ngoại thoải mái - MH100 đen/xám', 
      newPrice: 199000, 
      oldPrice: null, 
      brand: 'QUECHUA', 
      rating: 4.9, 
      reviews: 90, 
      label: 'SẢN PHẨM MỚI', 
      image: 'assets/gay.jpg' 
    }
  ];
}
