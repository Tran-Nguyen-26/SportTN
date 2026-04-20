import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../../core/services/product/product.service";
import {ProductPageResponse} from "../../../../core/models/product/product.model";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
    slug: string = '';

    productDetail?: ProductPageResponse;

    constructor(private route: ActivatedRoute, private productService: ProductService) {
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      // Mỗi khi URL thay đổi, code trong này sẽ chạy lại
      this.loadProductData(this.slug);
    });
  }

  loadProductData(slug: string): void {
    this.productService.getProductBySlug(slug).subscribe({
      next: (response) => {
        if (response.success) {
          this.productDetail = response.data;
          console.log('Dữ liệu sản phẩm đã về:', this.productDetail);
        }
      },
      error: (err) => {
        console.error('Không tìm thấy sản phẩm!', err);
      }
    });
  }
}
