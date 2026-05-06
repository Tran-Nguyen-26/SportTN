import { Component, OnInit, signal, computed } from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  // Dữ liệu mẫu mapping theo đúng cấu trúc Backend của Nguyên
  wishlistItems = signal<ProductCardResponse[]>([
    {
      id: 101,
      name: 'Giày Tennis Adidas Barricade 13',
      slug: 'giay-tennis-adidas-barricade-13',
      description: '',
      mainImageUrl: 'assets/images/adidas-barricade.jpg',
      brandName: 'Adidas',
      rating: 4.8,
      reviewCount: 156,
      soldCount: 1200,
      originalPrice: 3800000,
      salePrice: 3200000,
      effectivePrice: 3200000,
      discountPercent: 15,
      isOnSale: true,
      isNew: true,
      isBestSeller: true
    },
    {
      id: 102,
      name: 'Vợt Cầu Lông Yonex Astrox 88D Pro',
      slug: 'vot-cau-long-yonex-astrox-88d-pro',
      description: '',
      mainImageUrl: 'assets/images/yonex-astrox.jpg',
      brandName: 'Yonex',
      rating: 4.9,
      reviewCount: 89,
      soldCount: 450,
      originalPrice: 4100000,
      salePrice: 4100000,
      effectivePrice: 4100000,
      discountPercent: 0,
      isOnSale: false,
      isNew: false,
      isBestSeller: true
    }
  ]);

  successMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  itemCount = computed(() => this.wishlistItems().length);

  constructor() {}

  ngOnInit(): void {}

  removeFromWishlist(productId: number): void {
    this.wishlistItems.update(items => items.filter(item => item.id !== productId));
    this.showTemporaryMessage('Đã xóa sản phẩm khỏi danh sách yêu thích');
  }

  addToCart(product: ProductCardResponse): void {
    console.log('Thêm vào giỏ hàng sản phẩm ID:', product.id);
    this.showTemporaryMessage(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  private showTemporaryMessage(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
