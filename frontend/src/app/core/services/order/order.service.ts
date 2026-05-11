import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/enviroment';
import {ApiResponse} from "../../models/home-response/home-response";

// ── Enums / Union Types ───────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'       // Chờ xác nhận
  | 'CONFIRMED'     // Đã xác nhận
  | 'PROCESSING'    // Đang xử lý
  | 'SHIPPING'      // Đang giao hàng
  | 'DELIVERED'     // Đã giao hàng
  | 'CANCELLED'     // Đã hủy
  | 'REFUNDED';     // Đã hoàn tiền

export type PaymentStatus =
  | 'UNPAID'        // Chưa thanh toán
  | 'PAID'          // Đã thanh toán
  | 'REFUNDED';     // Đã hoàn tiền

export type PaymentMethod =
  | 'COD'          // Tiền mặt COD
  | 'CREDIT_CARD'   // Thẻ tín dụng
  | 'E_WALLET'      // Ví điện tử
  | 'BANK_TRANSFER';// Chuyển khoản

// ── ShippingInfo ──────────────────────────────────────────────────────────────
export interface ShippingInfo {
  id: number;
  receiverName: string;
  receiverPhone: string;
  addressFull: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

// ── OrderItem ─────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: number;
  variantId: number;
  productName: string;
  variantName?: string;
  color: string;
  size: string;
  imageUrl?: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

// ── Order (response từ BE) ────────────────────────────────────────────────────
export interface OrderResponse {
  id: number;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerNote?: string;
  cancelReason?: string;
  totalAmount: number;
  shippingFee: number;
  voucherDiscount: number;
  pointsDiscountAmount: number;
  finalAmount: number;
  pointsEarned: number;
  pointsUsed: number;
  itemCount: number;
  shippingInfo?: ShippingInfo;
  items?: OrderItem[];
  createdAt: string;
}

// ── Request DTOs gửi lên BE ───────────────────────────────────────────────────

export interface OrderItemRequest {
  /** variantId bắt buộc — BE entity chỉ join qua ProductVariant */
  variantId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  addressId: number;
  items: OrderItemRequest[];
  paymentMethod: PaymentMethod;
  voucherId?: number | null;
  customerNote?: string;
  pointsToUse?: number;
}

// ── Response từ BE sau khi tạo đơn ───────────────────────────────────────────

export interface CreateOrderResponse {
  orderId: number;
  orderCode: string;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

// ── Danh sách đơn hàng (admin & user) ────────────────────────────────────────

export interface OrderSummary {
  id: number;
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  finalAmount: number;
  itemCount: number;
  createdAt: string;
  shippingInfo?: Pick<ShippingInfo, 'receiverName' | 'receiverPhone' | 'addressFull'>;
}

// ── Phân trang ────────────────────────────────────────────────────────────────

export interface OrderPage {
  content: OrderResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── Filter params ─────────────────────────────────────────────────────────────

export interface OrderFilterParams {
  page?: number;
  size?: number;
  status?: OrderStatus | '';
  paymentStatus?: PaymentStatus | '';
  keyword?: string;
}

// ── Cancel / Update DTOs ──────────────────────────────────────────────────────

export interface CancelOrderRequest {
  cancelReason: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateShippingRequest {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// ── Label helpers ─────────────────────────────────────────────────────────────

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:    'Chờ xác nhận',
  CONFIRMED:  'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING:   'Đang giao hàng',
  DELIVERED:  'Đã giao hàng',
  CANCELLED:  'Đã hủy',
  REFUNDED:   'Đã hoàn tiền',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID:   'Chưa thanh toán',
  PAID:     'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD:          'Thanh toán khi nhận hàng (COD)',
  CREDIT_CARD:   'Thẻ tín dụng / Ghi nợ',
  E_WALLET:      'Ví điện tử',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING:    '#f59e0b',
  CONFIRMED:  '#3b82f6',
  PROCESSING: '#8b5cf6',
  SHIPPING:   '#06b6d4',
  DELIVERED:  '#16a34a',
  CANCELLED:  '#dc2626',
  REFUNDED:   '#6b7280',
};

export interface OrderStatsResponse {
  pending:   number;
  confirmed: number;
  shipping:  number;
  delivered: number;
  cancelled: number;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiCustomer = `${environment.apiUrl}/orders`;
  private readonly apiAdmin    = `${environment.apiUrl}/admin/orders`;

  constructor(private http: HttpClient) {}

  // ── Customer endpoints ──────────────────────────────────────────────────────

  /** Tạo đơn hàng mới */
  createOrder(payload: CreateOrderRequest): Observable<string> {
    return this.http.post<string>(this.apiCustomer, payload);
  }

  /** Lấy danh sách đơn của user hiện tại (có phân trang & filter) */
  getMyOrders(params: OrderFilterParams = {}): Observable<ApiResponse<OrderPage>> {
    const httpParams = this.buildParams(params);
    return this.http.get<ApiResponse<OrderPage>>(this.apiCustomer, { params: httpParams });
  }

  /** Lấy chi tiết đơn hàng theo id */
  getOrderById(id: number): Observable<ApiResponse<OrderResponse>> {
    return this.http.get<ApiResponse<OrderResponse>>(`${this.apiCustomer}/${id}`);
  }

  /** Lấy chi tiết đơn hàng theo orderCode */
  getOrderByCode(orderCode: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiCustomer}/code/${orderCode}`);
  }

  /** Hủy đơn hàng (Customer) */
  cancelOrder(id: number, reason?: string): Observable<ApiResponse<OrderSummary>> {
    const body: CancelOrderRequest = {
      cancelReason: reason || 'Khách hàng hủy đơn'
    };

    return this.http.post<ApiResponse<OrderSummary>>(
      `${this.apiCustomer}/${id}/cancel`,
      body
    );
  }
  // ── Admin endpoints ─────────────────────────────────────────────────────────

  adminGetOrders(params: OrderFilterParams = {}): Observable<ApiResponse<OrderPage>> {
    const httpParams = this.buildParams(params);
    return this.http.get<ApiResponse<OrderPage>>(this.apiAdmin, { params: httpParams });
  }

  adminGetOrderById(id: number): Observable<ApiResponse<OrderResponse>> {
    return this.http.get<ApiResponse<OrderResponse>>(`${this.apiAdmin}/${id}`);
  }

  adminCancelOrder(id: number, reason?: string): Observable<ApiResponse<OrderResponse>> {
    return this.http.post<ApiResponse<OrderResponse>>(
      `${this.apiAdmin}/${id}/cancel`,
      null,
      { params: reason ? { reason } : {} }
    );
  }

  /** Admin: cập nhật trạng thái đơn hàng */
  adminUpdateStatus(id: number, payload: UpdateOrderStatusRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiAdmin}/${id}/status`, payload);
  }

  /** Admin: cập nhật thông tin vận chuyển */
  adminUpdateShipping(id: number, payload: UpdateShippingRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiAdmin}/${id}/shipping`, payload);
  }

  adminGetOrderStats(): Observable<ApiResponse<OrderStatsResponse>> {
    return this.http.get<ApiResponse<OrderStatsResponse>>(`${this.apiAdmin}/summary/stats`);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private buildParams(filter: OrderFilterParams): HttpParams {
    let p = new HttpParams();
    if (filter.page    != null)  p = p.set('page',          filter.page);
    if (filter.size    != null)  p = p.set('size',          filter.size);
    if (filter.status)           p = p.set('status',        filter.status);
    if (filter.paymentStatus)    p = p.set('paymentStatus', filter.paymentStatus);
    if (filter.keyword)          p = p.set('keyword',       filter.keyword);
    return p;
  }
}
