import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../enviroments/enviroment";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";
import {VariantResponse} from "../../models/product/product.model";

export interface ProductDtoForCart {
  id: number;
  name: string,
  slug: string,
  brand: string;
  rating: number;
  reviewCounts: number;
}

export interface CartItemResponse {
  cartItemId: number;
  variant: VariantResponse;
  quantity: number;
  addedAt: string;
  subTotal: number;
  product: ProductDtoForCart;
}

export interface CartResponse {
  id: number;
  cartItems: CartItemResponse[];
  total: number;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) { }

  getCart(): Observable<ApiResponse<CartResponse>> {
    return this.http.get<ApiResponse<CartResponse>>(this.apiUrl);
  }

  addItemToCart(request: AddToCartRequest): Observable<ApiResponse<CartResponse>> {
    return this.http.post<ApiResponse<CartResponse>>(`${this.apiUrl}/items`, request);
  }

  removeItem(cartItemId: number): Observable<ApiResponse<CartResponse>> {
    console.log("Xóa cartItem: ", `${this.apiUrl}/items/${cartItemId}`);
    return this.http.delete<ApiResponse<CartResponse>>(`${this.apiUrl}/items/${cartItemId}`);
  }

  clearCart(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl);
  }
}
