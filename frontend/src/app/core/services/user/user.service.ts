import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { ApiResponse } from '../../models/home-response/home-response';
import { AdminUser, UserForm, UserRole } from '../../../feature-admin/pages/users/users.component';

export interface AdminUserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  status: string;
}

export interface AdminUserUpdateRequest {
  name: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  status: string;
}

export interface PermissionOption {
  id: number;
  name: string;
  value: string;
  description: string;
}


@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl_customer = `${environment.apiUrl}/customer`;
  private readonly apiUrl_admin    = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<ApiResponse<PermissionOption[]>> {
    return this.http.get<ApiResponse<PermissionOption[]>>(`${this.apiUrl_admin}/permissions`);
  }

  getAdminUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.apiUrl_admin}/users`);
  }

  getAdminUserById(id: number): Observable<ApiResponse<AdminUser>> {
    return this.http.get<ApiResponse<AdminUser>>(`${this.apiUrl_admin}/users/${id}`);
  }

  createAdminUser(request: AdminUserCreateRequest): Observable<ApiResponse<AdminUser>> {
    return this.http.post<ApiResponse<AdminUser>>(`${this.apiUrl_admin}/users`, request);
  }

  updateAdminUser(id: number, request: AdminUserUpdateRequest): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.apiUrl_admin}/users/${id}`, request);
  }

  toggleAdminUserStatus(id: number, active: boolean): Observable<ApiResponse<AdminUser>> {
    return this.http.patch<ApiResponse<AdminUser>>(
      `${this.apiUrl_admin}/users/${id}/active`, { active }
    );
  }

  deleteAdminUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl_admin}/users/${id}`);
  }
}
