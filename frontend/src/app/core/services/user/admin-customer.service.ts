import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../environments/enviroment";
import {ApiResponse} from "../../models/home-response/home-response";
import {PageResponse} from "../../models/page-response";
import {CustomerFilterParams} from "../../../feature-admin/pages/customers/customers.component";

export interface AdminCustomer {
  id: number;
  username: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: string;
  address?: string;
  gender?: string;
  birthday?: string;
  note?: string;
  orderHistory?: CustomerOrder[];
}

export interface CustomerOrder {
  id: number;
  orderCode: string;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  itemCount: number;
  createdAt: string;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  gender?: string;
  birthday?: string;
  note?: string;
  status?: string;
}

export interface ToggleActiveRequest {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCustomerService {
  private readonly API_URL = `${environment.apiUrl}/admin/customers`;

  constructor(private http: HttpClient) {}

  getAll(params: CustomerFilterParams = {}): Observable<ApiResponse<PageResponse<AdminCustomer>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 10);

    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.status)  httpParams = httpParams.set('status',  params.status);

    return this.http.get<ApiResponse<PageResponse<AdminCustomer>>>(
      this.API_URL, { params: httpParams }
    );
  }

  getById(id: number): Observable<ApiResponse<AdminCustomer>> {
    return this.http.get<ApiResponse<AdminCustomer>>(`${this.API_URL}/${id}`);
  }

  toggleActive(id: number, request: ToggleActiveRequest): Observable<ApiResponse<AdminCustomer>> {
    return this.http.patch<ApiResponse<AdminCustomer>>(`${this.API_URL}/${id}/active`, request);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  updateCustomer(id: number, request: UpdateCustomerRequest): Observable<ApiResponse<AdminCustomer>> {
    return this.http.put<ApiResponse<AdminCustomer>>(`${this.API_URL}/${id}`, request);
  }
}
