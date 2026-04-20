import { Component } from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  // Tạo 1 sản phẩm mẫu
  sampleProduct: ProductCardResponse = {
    id: 101,
    name: 'Kính bơi Ready xám',
    slug: '',
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
  };

  // Lặp lại sản phẩm mẫu thành 20 phần tử
  swimProducts = Array.from({ length: 20 }, () => this.sampleProduct);

  get totalProducts(): number {
    return this.swimProducts.length;
  }
}
