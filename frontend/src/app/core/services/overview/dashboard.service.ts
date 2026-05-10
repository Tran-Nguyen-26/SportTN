import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import {ApiResponse} from "../../models/home-response/home-response";

export interface DashboardStatsResponse {
  revenue: number;
  newOrders: number;
  newCustomers: number;
  totalProducts: number;
  revenueTrend: number;
  orderTrend: number;
  customerTrend: number;
}

export interface LowStockResponse {
  name: string;
  sku: string;
  stock: number;
}

export interface RevenueChartResponse {
  day: string;
  revenue: number;
  orders: number;
  revenuePercent?: number;
  orderPercent?: number;
}

export interface TopProductResponse {
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface OrderStatusSummary {
  status: string;
  count: number;
}

export interface RecentOrderResponse {
  id: number;
  orderCode: string;
  receiverName: string;
  itemCount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(period: 'today' | 'week' | 'month' | 'year' = 'today'): Observable<ApiResponse<DashboardStatsResponse>> {
    return this.http.get<ApiResponse<DashboardStatsResponse>>(`${this.apiUrl}/stats`, {
      params: { period }
    });
  }

  getRevenueChart(period: 'week' | 'month' | 'year' = 'week'): Observable<ApiResponse<RevenueChartResponse[]>> {
    return this.http.get<ApiResponse<RevenueChartResponse[]>>(`${this.apiUrl}/revenue-chart`, {
      params: { period }
    });
  }

  getTopProducts(period: 'week' | 'month' | 'year' = 'week'): Observable<ApiResponse<TopProductResponse[]>> {
    return this.http.get<ApiResponse<TopProductResponse[]>>(`${this.apiUrl}/top-products`, {
      params: { period }
    });
  }

  getLowStock(threshold: number = 10): Observable<ApiResponse<LowStockResponse[]>> {
    return this.http.get<ApiResponse<LowStockResponse[]>>(`${this.apiUrl}/low-stock`, {
      params: { threshold }
    });
  }

  getOrderStatusSummary(): Observable<ApiResponse<OrderStatusSummary[]>> {
    return this.http.get<ApiResponse<OrderStatusSummary[]>>(`${this.apiUrl}/order-status-summary`);
  }

  getRecentOrders(limit: number = 10): Observable<ApiResponse<RecentOrderResponse[]>> {
    return this.http.get<ApiResponse<RecentOrderResponse[]>>(`${this.apiUrl}/recent-orders`, {
      params: { limit }
    });
  }
}
