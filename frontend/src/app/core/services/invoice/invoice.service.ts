import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiResponse} from "../../models/home-response/home-response";
import {PageResponse} from "../../models/page-response";
import {environment} from "../../../../enviroments/enviroment";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface InvoiceItemResponse {
  productName: string;
  sku:         string;
  quantity:    number;
  unitPrice:   number;
  totalPrice:  number;
}

export interface InvoiceResponse {
  id:             number;
  invoiceNumber:  string;
  orderId:        string;
  customer:       string;
  initials:       string;
  issueDate:      string;
  dueDate:        string;
  amount:         number;
  paymentMethod:  string;
  status:         string;
  customerEmail:  string;
  customerPhone:  string;
  customerAddress: string;
  subtotal:       number;
  shippingFee:    number;
  discount:       number;
  taxAmount:      number;
  note:           string;
  items:          InvoiceItemResponse[];
}

export interface InvoiceStatsResponse {
  invoiceCount: number;
  paidCount:          number;
  pendingCount:       number;
  overdueCount:       number;
  totalPaidAmount:    number;
  totalPendingAmount: number;
}

export interface InvoiceFilterParams {
  status?:  string;
  keyword?: string;
  page?:    number;
  size?:    number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private readonly apiAdmin = `${environment.apiUrl}/admin/invoices`;

  constructor(private http: HttpClient) {}

  // ── GET ALL ───────────────────────────────────────────────────────────────

  getAllInvoices(params: InvoiceFilterParams): Observable<ApiResponse<PageResponse<InvoiceResponse>>> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 10);

    if (params.status)  httpParams = httpParams.set('status',  params.status);
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);

    return this.http.get<ApiResponse<PageResponse<InvoiceResponse>>>(
      `${this.apiAdmin}`, { params: httpParams }
    );
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────

  getInvoiceById(id: number): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.get<ApiResponse<InvoiceResponse>>(`${this.apiAdmin}/${id}`);
  }

  // ── GET BY ORDER ID ───────────────────────────────────────────────────────

  getInvoiceByOrderId(orderId: number): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.get<ApiResponse<InvoiceResponse>>(`${this.apiAdmin}/order/${orderId}`);
  }

  // ── UPDATE STATUS ─────────────────────────────────────────────────────────

  updateStatus(id: number, status: string): Observable<ApiResponse<InvoiceResponse>> {
    return this.http.patch<ApiResponse<InvoiceResponse>>(
      `${this.apiAdmin}/${id}/status`,
      null,
      { params: { status } }
    );
  }

  // ── STATS ─────────────────────────────────────────────────────────────────

  getStats(): Observable<ApiResponse<InvoiceStatsResponse>> {
    return this.http.get<ApiResponse<InvoiceStatsResponse>>(`${this.apiAdmin}/summary/stats`);
  }
}
