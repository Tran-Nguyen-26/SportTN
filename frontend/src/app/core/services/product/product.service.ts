import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/enviroment";
import {HttpClient, HttpParams} from "@angular/common/http";
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

  getProductsForAdmin(params: {
    page?: number;
    size?: number;
    keyword?: string;
    categorySlug?: string;
    active?: boolean;
  }): Observable<ApiResponse<PageResponse<ProductAdminResponse>>> {

    let httpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 10);

    if (params.keyword)           httpParams = httpParams.set('keyword',      params.keyword);
    if (params.categorySlug)      httpParams = httpParams.set('categorySlug', params.categorySlug);
    if (params.active !== undefined) httpParams = httpParams.set('active',    String(params.active));

    return this.http.get<ApiResponse<PageResponse<ProductAdminResponse>>>(
      `${this.apiUrl}/list`, { params: httpParams }
    );
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

  searchProducts(q: string, page = 0, size = 10): Observable<ApiResponse<PageResponse<ProductCardResponse>>> {
    return this.http.get<ApiResponse<PageResponse<ProductCardResponse>>>(
      `${this.apiUrl}/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
    );
  }

  getProductsByFilter(params: any): Observable<ApiResponse<PageResponse<ProductCardResponse>>> {
    return this.http.get<ApiResponse<PageResponse<ProductCardResponse>>>(
      `${this.apiUrl}/filtered`,
      { params }
    );
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/admin/${id}`);
  }
}
