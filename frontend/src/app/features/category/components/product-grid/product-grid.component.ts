import { Component } from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  selectedSort: 'popularity' | 'priceAsc' | 'priceDesc' | 'newest' = 'popularity';
  pageSize = 12;

  private readonly allProducts: ProductCardResponse[] = [
    {
      id: 101, name: 'Giày chạy bộ Run Active Grip', slug: 'giay-chay-run-active-grip',
      mainImageUrl: 'assets/giaychay.jpg', brandName: 'KALENJI', rating: 4.7, reviewCount: 215, soldCount: 1630,
      originalPrice: 990000, salePrice: 790000, effectivePrice: 790000, discountPercent: 20, isOnSale: true, isNew: false, isBestSeller: true
    },
    {
      id: 102, name: 'Áo thun thể thao Dry 100', slug: 'ao-thun-dry-100',
      mainImageUrl: 'assets/aothun.jpg', brandName: 'DOMYOS', rating: 4.5, reviewCount: 134, soldCount: 980,
      originalPrice: 199000, salePrice: 169000, effectivePrice: 169000, discountPercent: 15, isOnSale: true, isNew: true, isBestSeller: false
    },
    {
      id: 103, name: 'Bình nước thể thao 1L', slug: 'binh-nuoc-the-thao-1l',
      mainImageUrl: 'assets/binhnuoc.jpg', brandName: 'QUECHUA', rating: 4.8, reviewCount: 286, soldCount: 2200,
      originalPrice: 129000, salePrice: 99000, effectivePrice: 99000, discountPercent: 23, isOnSale: true, isNew: false, isBestSeller: true
    },
    {
      id: 104, name: 'Bóng đá F500 sân cỏ nhân tạo', slug: 'bong-da-f500',
      mainImageUrl: 'assets/bongda.jpg', brandName: 'KIPSTA', rating: 4.4, reviewCount: 95, soldCount: 720,
      originalPrice: 349000, salePrice: 349000, effectivePrice: 349000, discountPercent: 0, isOnSale: false, isNew: false, isBestSeller: false
    }
  ];

  private readonly mockProducts = Array.from({ length: 24 }, (_, index) => {
    const base = this.allProducts[index % this.allProducts.length];
    const id = base.id + index * 10;
    const dynamicPrice = Math.max(base.effectivePrice - (index % 5) * 5000, 49000);
    const originalPrice = dynamicPrice + (base.discountPercent > 0 ? 30000 : 0);

    return {
      ...base,
      id,
      slug: `${base.slug}-${id}`,
      name: `${base.name} ${index + 1}`,
      rating: Math.min(5, Number((base.rating - (index % 3) * 0.1).toFixed(1))),
      reviewCount: base.reviewCount + index * 7,
      soldCount: base.soldCount + index * 20,
      effectivePrice: dynamicPrice,
      salePrice: dynamicPrice,
      originalPrice,
      discountPercent: originalPrice > dynamicPrice ? Math.round(((originalPrice - dynamicPrice) / originalPrice) * 100) : 0,
      isOnSale: originalPrice > dynamicPrice,
      isNew: index < 8,
      isBestSeller: index % 4 === 0
    };
  });

  get sortedProducts(): ProductCardResponse[] {
    const products = [...this.mockProducts];
    switch (this.selectedSort) {
      case 'priceAsc':
        return products.sort((a, b) => a.effectivePrice - b.effectivePrice);
      case 'priceDesc':
        return products.sort((a, b) => b.effectivePrice - a.effectivePrice);
      case 'newest':
        return products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return products.sort((a, b) => b.soldCount - a.soldCount);
    }
  }

  get visibleProducts(): ProductCardResponse[] {
    return this.sortedProducts.slice(0, this.pageSize);
  }

  get totalProducts(): number {
    return this.mockProducts.length;
  }

  get canLoadMore(): boolean {
    return this.pageSize < this.totalProducts;
  }

  onSortChange(value: string): void {
    this.selectedSort = value as 'popularity' | 'priceAsc' | 'priceDesc' | 'newest';
    this.pageSize = 12;
  }

  onLoadMore(): void {
    this.pageSize = Math.min(this.pageSize + 6, this.totalProducts);
  }

  onBackToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByProductId(_: number, product: ProductCardResponse): number {
    return product.id;
  }
}
