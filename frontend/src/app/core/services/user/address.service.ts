import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/home-response/home-response";

export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressRequest {
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private readonly api = `${environment.apiUrl}/users/addresses`;

  constructor(private http: HttpClient) {}

  getMyAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(this.api);
  }

  createAddress(req: AddressRequest): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(this.api, req);
  }

  updateAddress(id: number, req: AddressRequest): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.api}/${id}`, req);
  }

  deleteAddress(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }

  setDefault(id: number): Observable<ApiResponse<Address>> {
    return this.http.patch<ApiResponse<Address>>(`${this.api}/${id}/default`, {});
  }

}
