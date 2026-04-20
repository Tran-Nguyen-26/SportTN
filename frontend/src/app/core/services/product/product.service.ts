import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../models/home-response/home-response";
import {Observable} from "rxjs";
import {ProductPageResponse} from "../../models/product/product.model";

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
}
