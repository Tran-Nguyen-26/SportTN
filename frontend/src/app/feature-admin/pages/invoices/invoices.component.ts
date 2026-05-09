import { Component, OnInit, computed, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  InvoiceService,
  InvoiceResponse,
  InvoiceStatsResponse,
  InvoiceFilterParams
} from '../../../core/services/invoice/invoice.service';
import {ProductService} from "../../../core/services/product/product.service";
import {UserService} from "../../../core/services/user/user.service";

export interface InvoiceForm {
  customerId:      number | null;
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string;
  customerAddress: string;
  paymentMethod:   string;
  dueDate:         string;
  note:            string;
  items:           InvoiceFormItem[];
  shippingFee:     number;
  discount:        number;
  taxPercent:      number;
}

export interface InvoiceFormItem {
  productName: string;
  sku:         string;
  quantity:    number;
  unitPrice:   number;
}

interface CustomerOption {
  id:      number;
  name:    string;
  email:   string;
  phone:   string;
  address: string;
}

interface ProductOption {
  name:  string;
  sku:   string;
  price: number;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  // ── State ─────────────────────────────────────────────────────────────────
  isLoading      = false;
  invoices       = signal<InvoiceResponse[]>([]);
  totalElements  = 0;
  pageIndex      = 0;
  pageSize       = 10;

  searchQuery    = signal('');
  selectedStatus = signal('');

  selectedInvoice: InvoiceResponse | null = null;

  stats: InvoiceStatsResponse = {
    invoiceCount: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0
  };

  customerList: CustomerOption[] = [];
  productList:  ProductOption[]  = [];

  // ── Filter ────────────────────────────────────────────────────────────────
  statusOptions = [
    { value: '',        label: 'Tất cả'         },
    { value: 'PAID',    label: 'Đã thanh toán'  },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'OVERDUE', label: 'Quá hạn'        },
  ];

  // ── Create drawer ─────────────────────────────────────────────────────────
  createVisible = false;
  form: InvoiceForm = this.emptyForm();
  paymentMethods = ['VNPay', 'COD', 'Momo', 'Banking'];

  constructor(
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadInvoices();
    this.loadStats();
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadInvoices(): void {
    this.isLoading = true;

    const params: InvoiceFilterParams = {
      page:    this.pageIndex,
      size:    this.pageSize,
      status:  this.selectedStatus() || undefined,
      keyword: this.searchQuery()    || undefined
    };

    this.invoiceService.getAllInvoices(params).subscribe({
      next: (res) => {
        if (res.data) {
          this.invoices.set(res.data.content);
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[INVOICE] Lỗi tải hóa đơn:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Load customers ────────────────────────────────────────────────────────
  loadCustomers(): void {
    this.userService.getCustomers({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        if (res.data) {
          this.customerList = res.data.content.map(u => ({
            id:      u.id,
            name:    u.fullname,
            email:   u.email,
            phone:   u.phone ?? '',
            address: ''        // UserService chưa trả address → để trống
          }));
        }
      },
      error: (err) => console.error('[INVOICE] Lỗi tải khách hàng:', err)
    });
  }

// ── Load products ─────────────────────────────────────────────────────────
  loadProducts(): void {
    this.productService.getProductsForAdmin({ page: 0, size: 100, active: true }).subscribe({
      next: (res) => {
        if (res.data) {
          this.productList = res.data.content.map(p => ({
            name:  p.name,
            sku:   '',
            price: p.minPrice
          }));
        }
      },
      error: (err) => console.error('[INVOICE] Lỗi tải sản phẩm:', err)
    });
  }

  loadStats(): void {
    this.invoiceService.getStats().subscribe({
      next: (res) => {
        if (res.data) this.stats = res.data;
      },
      error: (err) => console.error('[INVOICE] Lỗi tải thống kê:', err)
    });
  }

  // ── Filter & Search ───────────────────────────────────────────────────────
  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.pageIndex = 0;
    this.loadInvoices();
  }

  onSearch(keyword: string): void {
    this.searchQuery.set(keyword);
    this.pageIndex = 0;
    this.loadInvoices();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadInvoices();
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  openInvoice(invoice: InvoiceResponse): void {
    this.selectedInvoice = invoice;

    // Gọi API lấy chi tiết đầy đủ
    this.invoiceService.getInvoiceById(invoice.id).subscribe({
      next: (res) => {
        if (res.data) this.selectedInvoice = res.data;
      },
      error: (err) => console.error('[INVOICE] Lỗi tải chi tiết:', err)
    });
  }

  closeInvoice(): void {
    this.selectedInvoice = null;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeInvoice();
    }
  }

  // ── Update Status ─────────────────────────────────────────────────────────
  updateStatus(id: number, status: string): void {
    this.invoiceService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadInvoices();
        this.loadStats();
        this.closeInvoice();
      },
      error: (err) => console.error('[INVOICE] Lỗi cập nhật trạng thái:', err)
    });
  }

  // ── Print ─────────────────────────────────────────────────────────────────
  printInvoice(): void {
    window.print();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getStatusInvoice(status: string): { label: string; css: string } {
    const map: Record<string, { label: string; css: string }> = {
      'PAID':    { label: 'Đã TT',   css: 'badge-paid'    },
      'PENDING': { label: 'Chờ TT',  css: 'badge-pending' },
      'OVERDUE': { label: 'Quá hạn', css: 'badge-overdue' },
    };
    return map[status] ?? { label: status, css: '' };
  }

  // ── Create drawer ─────────────────────────────────────────────────────────
  openCreate(): void {
    this.form          = this.emptyForm();
    this.loadCustomers();
    this.loadProducts();
    this.createVisible = true;
  }

  closeCreate(): void {
    this.createVisible = false;
  }

  onCreateOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('create-overlay')) {
      this.closeCreate();
    }
  }

  // ── Form helpers ──────────────────────────────────────────────────────────
  get formSubtotal(): number {
    return this.form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  }

  get formTax(): number {
    return Math.round(this.formSubtotal * this.form.taxPercent / 100);
  }

  get formTotal(): number {
    return this.formSubtotal + this.form.shippingFee - this.form.discount + this.formTax;
  }

  addItem(): void {
    this.form.items.push({ productName: '', sku: '', quantity: 1, unitPrice: 0 });
  }

  removeItem(index: number): void {
    if (this.form.items.length > 1) this.form.items.splice(index, 1);
  }

  isFormValid(): boolean {
    return !!(
      this.form.customerName &&
      this.form.paymentMethod &&
      this.form.items.length > 0 &&
      this.form.items.every(i => i.productName && i.quantity > 0 && i.unitPrice > 0)
    );
  }

  // ── Paginator helpers ─────────────────────────────────────────────────────
  get pageStart(): number {
    return this.pageIndex * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalElements);
  }

  private emptyForm(): InvoiceForm {
    return {
      customerId:      null,
      customerName:    '',
      customerEmail:   '',
      customerPhone:   '',
      customerAddress: '',
      paymentMethod:   'COD',
      dueDate:         '',
      note:            '',
      items:           [{ productName: '', sku: '', quantity: 1, unitPrice: 0 }],
      shippingFee:     0,
      discount:        0,
      taxPercent:      10,
    };
  }

  onSelectCustomer(customerId: number): void {
    if (!customerId) {
      this.form.customerId      = null;
      this.form.customerName    = '';
      this.form.customerEmail   = '';
      this.form.customerPhone   = '';
      this.form.customerAddress = '';
      return;
    }

    const cust = this.customerList.find(c => c.id === +customerId);
    if (!cust) return;
    this.form.customerId      = cust.id;
    this.form.customerName    = cust.name;
    this.form.customerEmail   = cust.email;
    this.form.customerPhone   = cust.phone;
    this.form.customerAddress = cust.address;
  }

  onSelectProduct(index: number, productName: string): void {
    if (!productName) {
      this.form.items[index].sku       = '';
      this.form.items[index].unitPrice = 0;
      return;
    }

    const prod = this.productList.find(p => p.name === productName);
    if (!prod) return;

    this.form.items[index].productName = prod.name;
    this.form.items[index].sku         = prod.sku;
    this.form.items[index].unitPrice   = prod.price;
  }

  saveInvoice() {

  }

  protected readonly Math = Math;
}
