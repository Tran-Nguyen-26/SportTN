import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  parentId: number;
  description: string;
  sectionTitle: string;
  linkUrl: string;
  imageUrl: string;
  displayOrder: number;
  showOnHome: boolean;
  active: boolean;
}


export interface CategoryAdminResponse {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  parent: string;
  description: string;
  sectionTitle: string;
  linkUrl: string;
  imageUrl: string;
  productCount: number;
  displayOrder: number;
  showOnHome: boolean;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly API_URL = `${environment.apiUrl}/categories`

  constructor(private http: HttpClient) { }

  getCategoryAdminResponse(): Observable<ApiResponse<CategoryAdminResponse[]>> {
    return this.http.get<ApiResponse<CategoryAdminResponse[]>>(`${this.API_URL}/admin-list`);
  }
}
