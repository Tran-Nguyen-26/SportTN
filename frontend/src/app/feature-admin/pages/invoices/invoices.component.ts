import {Component, computed, signal} from '@angular/core';

export interface AdminInvoice {
  id: string;
  orderId: string;
  customer: string;
  initials: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  note: string;
}

export interface InvoiceItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {

  searchQuery  = signal('');
  selectedStatus = signal('');

  selectedInvoice: AdminInvoice | null = null;

  statusOptions = [
    { value: '',       label: 'Tất cả' },
    { value: 'PAID',   label: 'Đã thanh toán' },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'OVERDUE', label: 'Quá hạn' },
  ];

  invoices =signal<AdminInvoice[]>([
    {
      id: 'INV-001', orderId: '#DH001',
      customer: 'Nguyễn Văn An', initials: 'NA',
      issueDate: '01/04/2025', dueDate: '08/04/2025',
      amount: 1200000, paymentMethod: 'VNPay', status: 'PAID',
      customerEmail:   'an.nguyen@gmail.com',
      customerPhone:   '0901 234 567',
      customerAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      subtotal:    1100000,
      shippingFee: 30000,
      discount:    0,
      tax:         110000,
      note:        'Giao hàng giờ hành chính',
      items: [
        { productName: 'Giày Nike Air Zoom Pegasus',   sku: 'RUN-NK-PG-42', quantity: 1, unitPrice: 850000,  totalPrice: 850000  },
        { productName: 'Tất chạy bộ Run 100 x3',       sku: 'RUN-SOCK-M',   quantity: 1, unitPrice: 79000,   totalPrice: 79000   },
        { productName: 'Balo chạy bộ Trail 10L',        sku: 'RUN-BAG-10L',  quantity: 1, unitPrice: 171000,  totalPrice: 171000  },
      ]
    },
    {
      id: 'INV-002', orderId: '#DH002',
      customer: 'Trần Thị Bình', initials: 'TB',
      issueDate: '02/04/2025', dueDate: '09/04/2025',
      amount: 450000, paymentMethod: 'COD', status: 'PENDING',
      customerEmail:   'binh.tran@gmail.com',
      customerPhone:   '0912 345 678',
      customerAddress: '456 Lê Lợi, Quận 3, TP.HCM',
      subtotal:    390000,
      shippingFee: 35000,
      discount:    15000,
      tax:         39000,
      note:        '',
      items: [
        { productName: 'Áo Decathlon Run Dry Nam',  sku: 'RUN-SHIRT-M-BLUE', quantity: 2, unitPrice: 199000, totalPrice: 398000 },
      ]
    },
    {
      id: 'INV-003', orderId: '#DH003',
      customer: 'Lê Văn Cường', initials: 'LC',
      issueDate: '28/03/2025', dueDate: '04/04/2025',
      amount: 890000, paymentMethod: 'Momo', status: 'OVERDUE',
      customerEmail:   'cuong.le@gmail.com',
      customerPhone:   '0923 456 789',
      customerAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
      subtotal:    800000,
      shippingFee: 25000,
      discount:    0,
      tax:         80000,
      note:        'Khách yêu cầu gọi điện trước khi giao',
      items: [
        { productName: 'Kính bơi Nabaiji Ready Xám',  sku: 'GOG-NAB-GRAY',  quantity: 1, unitPrice: 129000,  totalPrice: 129000  },
        { productName: 'Mũ bơi silicon Hồng',          sku: 'CAP-SIL-PINK',  quantity: 2, unitPrice: 199000,  totalPrice: 398000  },
        { productName: 'Đồ bơi nữ Heva',               sku: 'SWM-HEVA-M',    quantity: 1, unitPrice: 273000,  totalPrice: 273000  },
      ]
    },
    {
      id: 'INV-004', orderId: '#DH004',
      customer: 'Phạm Thị Dung', initials: 'PD',
      issueDate: '03/04/2025', dueDate: '10/04/2025',
      amount: 79000, paymentMethod: 'VNPay', status: 'PAID',
      customerEmail:   'dung.pham@gmail.com',
      customerPhone:   '0934 567 890',
      customerAddress: '321 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM',
      subtotal:    79000,
      shippingFee: 0,
      discount:    0,
      tax:         7900,
      note:        '',
      items: [
        { productName: 'Tất chạy bộ Run 100 x3 Đen',  sku: 'RUN-SOCK-3P-M', quantity: 1, unitPrice: 79000, totalPrice: 79000 },
      ]
    },
  ]);

  paidCount = computed(() => this.invoices().filter(i => i.status === 'PAID').length);
  pendingCount = computed(() => this.invoices().filter(i => i.status === 'PENDING').length);
  overdueCount = computed(() => this.invoices().filter(i => i.status === 'OVERDUE').length);

  // 2. Tính tổng tiền (Thay cho totalPaid() và totalPending() cũ)
  totalPaidAmount = computed(() =>
    this.invoices()
      .filter(i => i.status === 'PAID')
      .reduce((s, i) => s + i.amount, 0)
  );

  totalPendingAmount = computed(() =>
    this.invoices()
      .filter(i => i.status === 'PENDING')
      .reduce((s, i) => s + i.amount, 0)
  );

  // 3. Danh sách đã lọc cho Table
  filteredInvoices = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();

    return this.invoices().filter(inv => {
      const matchStatus = !status || inv.status === status;
      const matchSearch = !query
        || inv.id.toLowerCase().includes(query)
        || inv.customer.toLowerCase().includes(query)
        || inv.orderId.toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  });

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getStatusInvoice(status: string) {
    const map: Record<string, { label: string; css: string }> = {
      'PAID':    { label: 'Đã TT',   css: 'badge-paid'    },
      'PENDING': { label: 'Chờ TT',  css: 'badge-pending' },
      'OVERDUE': { label: 'Quá hạn',  css: 'badge-overdue' },
    };
    return map[status] || { label: status, css: '' };
  }

  openInvoice(invoice: AdminInvoice): void {
    this.selectedInvoice = invoice;
  }

  closeInvoice(): void {
    this.selectedInvoice = null;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeInvoice();
    }
  }

  printInvoice(): void {
    window.print();
  }

  totalPaid = computed(() => {
    return this.invoices()
      .filter(i => i.status === 'PAID')
      .reduce((s, i) => s + i.amount, 0);
  });

// Tính tổng chờ thanh toán
  totalPending = computed(() => {
    return this.invoices()
      .filter(i => i.status === 'PENDING')
      .reduce((s, i) => s + i.amount, 0);
  });
}
