import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";
import {CategoryOption} from "../../../feature-admin/pages/banners/banners.component";

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  parentId: number | null;
  description: string | null;
  sectionTitle: string | null;
  linkUrl: string;
  imageUrl: string;
  displayOrder: number;
  showOnHome: boolean;
  active: boolean;
}

export interface CategoryUpdateRequest extends CategoryCreateRequest {

}


export interface CategoryAdminResponse {
  categoryId: number;
  name: string;
  slug: string;
  parentId: number;
  parentName: string;
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

  getCategoryOption(): Observable<ApiResponse<CategoryOption[]>> {
    return this.getCategoryAdminResponse().pipe(
      map(res => {
        const optionData = (res.data ?? []).map((item: CategoryAdminResponse) => ({
          id: item.categoryId,
          name: item.name,
          slug: item.slug
        }));

        return {
          ...res,
          data: optionData
        };
      })
    );
  }

  createCategory(request: CategoryCreateRequest): Observable<ApiResponse<CategoryAdminResponse>> {
    return this.http.post<ApiResponse<CategoryAdminResponse>>(`${this.API_URL}`, request);
  }

  updateCategory(id: number, request: CategoryUpdateRequest): Observable<ApiResponse<CategoryAdminResponse>> {
    return this.http.put<ApiResponse<CategoryAdminResponse>>(`${this.API_URL}/${id}`, request);
  }

  toggleShowOnHome(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.API_URL}/${id}/toggle-show-on-home`, {});
  }

  deleteCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`);
  }
}
