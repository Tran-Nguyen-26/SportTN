import { Component, Input, signal } from '@angular/core';
import { ProductPageResponse, VariantResponse } from "../../../../core/models/product/product.model";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  @Input() productDetail?: ProductPageResponse;

  selectedColor: string | null = null;
  selectedSizeName: string | null = null;
  selectedVariantId: number | null = null;
  selectedQty: number = 1;

  getUniqueColors(): string[] {
    if (!this.productDetail) return [];
    const colors = this.productDetail.variantResponses.map(v => v.color);
    return [...new Set(colors)];
  }

  selectColor(color: string) {
    this.selectedColor = color;
    // Reset size và variant khi đổi màu để tránh xung đột
    this.selectedSizeName = null;
    this.selectedVariantId = null;
  }

  selectVariant(variant: VariantResponse) {
    if (variant.stockQuantity > 0) {
      this.selectedVariantId = variant.id;
      this.selectedSizeName = variant.size;
    }
  }

  // Cập nhật số lượng
  updateQty(val: number) {
    const newQty = this.selectedQty + val;
    // Kiểm tra tồn kho của variant đang chọn (nếu có)
    const currentVariant = this.productDetail?.variantResponses.find(v => v.id === this.selectedVariantId);
    const maxStock = currentVariant ? currentVariant.stockQuantity : 10;

    if (newQty >= 1 && newQty <= maxStock) {
      this.selectedQty = newQty;
    }
  }

  // Logic hỗ trợ hiển thị: Lấy các biến thể theo màu đã chọn
  getAvailableVariantsByColor(): VariantResponse[] {
    if (!this.productDetail || !this.selectedColor) return [];
    return this.productDetail.variantResponses.filter(v => v.color === this.selectedColor);
  }
}
