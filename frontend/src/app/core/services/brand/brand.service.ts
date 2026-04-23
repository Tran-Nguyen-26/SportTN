import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";
import {BrandAddRequest, BrandResponse} from "../../models/brand/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private readonly apiUrl = `${environment.apiUrl}/brands`;

  constructor(private http: HttpClient) { }

  getBrands(): Observable<ApiResponse<BrandResponse[]>> {
    return this.http.get<ApiResponse<BrandResponse[]>>(this.apiUrl);
  }

  addBrand(request: BrandAddRequest): Observable<ApiResponse<BrandResponse>> {
    return this.http.post<ApiResponse<BrandResponse>>(this.apiUrl, request);
  }

  updateBrand(id: number, request: BrandAddRequest): Observable<ApiResponse<BrandResponse>> {
    return this.http.put<ApiResponse<BrandResponse>>(`${this.apiUrl}/id/${id}`, request);
  }
}
