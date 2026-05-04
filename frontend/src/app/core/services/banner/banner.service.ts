import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";

export interface BannerCreateRequest {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  displayOrder: number;
  active: boolean;
  startDate: string;
  endDate: string;
  // previewColor: string;
  altText: string;
}

export interface BannerResponse {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  displayOrder: number;
  active: boolean;
  startDate: string;
  endDate: string;
  previewColor: string;
  altText: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private readonly apiUrl = `${environment.apiUrl}/admin/banners`;

  constructor(private http: HttpClient) { }

  getAllBanners(): Observable<ApiResponse<BannerResponse[]>> {
    return this.http.get<ApiResponse<BannerResponse[]>>(`${this.apiUrl}`);
  }

  createBanner(request: BannerCreateRequest): Observable<ApiResponse<BannerResponse>> {
    return this.http.post<ApiResponse<BannerResponse>>(`${this.apiUrl}`, request);
  }
}
