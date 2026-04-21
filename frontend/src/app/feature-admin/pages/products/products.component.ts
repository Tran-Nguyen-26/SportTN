import { Component } from '@angular/core';

export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sold: number;
  rating: number;
  status: string;
  image: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  searchQuery = '';
  selectedCategory = '';
  viewMode: 'table' | 'grid' = 'table';

  categories = [
    { value: '',           label: 'Tất cả danh mục' },
    { value: 'Bơi lội',   label: 'Bơi lội' },
    { value: 'Chạy bộ',   label: 'Chạy bộ' },
    { value: 'Chống nắng', label: 'Chống nắng' },
  ];

  products: AdminProduct[] = [
    { id: 1,  name: 'Kính bơi cận Nabaiji',       category: 'Bơi lội',    brand: 'NABAIJI',    price: 149000, salePrice: 129000, stock: 125, sold: 15000, rating: 4.7, status: 'ACTIVE',   image: 'KB' },
    { id: 2,  name: 'Mũ bơi silicon 500 Hồng',    category: 'Bơi lội',    brand: 'NABAIJI',    price: 199000, salePrice: null,   stock: 245, sold: 12000, rating: 4.3, status: 'ACTIVE',   image: 'MB' },
    { id: 3,  name: 'Áo thun chạy bộ Run Dry',    category: 'Chạy bộ',    brand: 'KIPRUN',     price: 299000, salePrice: 199000, stock: 380, sold: 45000, rating: 4.7, status: 'ACTIVE',   image: 'AT' },
    { id: 4,  name: 'Tất chạy bộ Run 100 x3',     category: 'Chạy bộ',    brand: 'KIPRUN',     price: 99000,  salePrice: 79000,  stock: 520, sold: 52000, rating: 4.7, status: 'ACTIVE',   image: 'TC' },
    { id: 5,  name: 'Mũ lưỡi trai Travel 100',    category: 'Chống nắng', brand: 'DECATHLON',  price: 99000,  salePrice: 59000,  stock: 540, sold: 38000, rating: 4.8, status: 'ACTIVE',   image: 'ML' },
    { id: 6,  name: 'Kính mát hiking MH100',       category: 'Chống nắng', brand: 'DECATHLON',  price: 129000, salePrice: 99000,  stock: 170, sold: 13000, rating: 4.6, status: 'ACTIVE',   image: 'KM' },
    { id: 7,  name: 'Đồng hồ GPS CW500',           category: 'Chạy bộ',    brand: 'DECATHLON',  price: 890000, salePrice: null,   stock: 0,   sold: 7200,  rating: 4.3, status: 'OUT_STOCK', image: 'DH' },
    { id: 8,  name: 'Áo chống nắng Desert 500',    category: 'Chống nắng', brand: 'QUECHUA',    price: 349000, salePrice: 299000, stock: 210, sold: 24000, rating: 4.7, status: 'ACTIVE',   image: 'AC' },
  ];

  get filteredProducts(): AdminProduct[] {
    return this.products.filter(p => {
      const matchCat    = !this.selectedCategory || p.category === this.selectedCategory;
      const matchSearch = !this.searchQuery
        || p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        || p.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}
