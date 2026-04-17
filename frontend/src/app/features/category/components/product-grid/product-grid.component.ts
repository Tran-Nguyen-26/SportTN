import { Component } from '@angular/core';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  // Tạo 1 sản phẩm mẫu
  sampleProduct = {
    name: 'Kính bơi Ready xám',
    newPrice: 69000,
    oldPrice: null,
    brand: 'DECATHLON',
    rating: 4.5,
    reviews: 115,
    label: 'MỚI',
    image: 'assets/kinhboi.jpg'
  };

  // Lặp lại sản phẩm mẫu thành 20 phần tử
  swimProducts = Array.from({ length: 20 }, () => this.sampleProduct);

  get totalProducts(): number {
    return this.swimProducts.length;
  }
}
