import {Component, Input} from '@angular/core';
import {ProductPageResponse} from "../../../../core/models/product/product.model";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  @Input() productDetail?: ProductPageResponse;

  selectedQty: number = 1;
  selectedVariantId: number | null = null;

  // Lấy danh sách màu không trùng lặp
  getUniqueColors(): string[] {
    if (!this.productDetail) return [];
    const colors = this.productDetail.variantResponses.map(v => v.color);
    return [...new Set(colors)];
  }

  updateQty(val: number) {
    const newQty = this.selectedQty + val;
    if (newQty >= 1 && newQty <= 10) { // Giả sử giới hạn 10 sản phẩm
      this.selectedQty = newQty;
    }
  }

  onSizeChange(event: any) {
    this.selectedVariantId = event.target.value;
    console.log('Đã chọn Variant ID:', this.selectedVariantId);
  }
}
