import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/enviroment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse, ProductCardResponse} from "../../models/home-response/home-response";
import {Observable} from "rxjs";
import {
  ProductAdminResponse,
  ProductDetail,
  ProductPageResponse, VariantResponse,
} from "../../models/product/product.model";
import {ListRange} from "@angular/cdk/collections";
import {PageResponse} from "../../models/page-response";
import {
  ProductCreateRequest,
  ProductUpdateRequest
} from "../../../feature-admin/components/add-product/add-product.component";


export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  mainImageUrl: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  active: boolean;
  totalStock: number;
  minPrice: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProductBySlug(slug: string): Observable<ApiResponse<ProductPageResponse>> {
    return this.http.get<ApiResponse<ProductPageResponse>>(`${this.apiUrl}/slug/${slug}`);
  }

  getProductById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/id/${id}`);
  }

  getPopularProducts(): Observable<ApiResponse<ProductCardResponse[]>> {
    return this.http.get<ApiResponse<ProductCardResponse[]>>(`${this.apiUrl}/popular`);
  }

  getProductsForAdmin(params: any): Observable<ApiResponse<PageResponse<ProductAdminResponse>>> {
    return this.http.get<ApiResponse<PageResponse<ProductAdminResponse>>>(`${this.apiUrl}/list`, { params })
  }

  updateProduct(id: number, data: ProductUpdateRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.put<ApiResponse<ProductDetail>>(`${this.apiUrl}/${id}`, data);
  }

  getEditDetail(id: number): Observable<ApiResponse<ProductDetail>> {
    return this.http.get<ApiResponse<ProductDetail>>(`${this.apiUrl}/${id}/detail`);
  }

  createProduct(request: ProductCreateRequest): Observable<ApiResponse<ProductResponse>> {
    return this.http.post<ApiResponse<ProductResponse>>(this.apiUrl, request);
  }

  getProductVariantsByProductId(productId: number): Observable<ApiResponse<VariantResponse[]>> {
    return this.http.get<ApiResponse<VariantResponse[]>>(`${this.apiUrl}/${productId}/variants`);
  }
}
