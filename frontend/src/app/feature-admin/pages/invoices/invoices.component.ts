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

export interface InvoiceForm {
  customerId:     number | null;
  customerName:   string;
  customerEmail:  string;
  customerPhone:  string;
  customerAddress: string;
  paymentMethod:  string;
  dueDate:        string;
  note:           string;
  items:          InvoiceFormItem[];
  shippingFee:    number;
  discount:       number;
  taxPercent:     number;
}

export interface InvoiceFormItem {
  productName: string;
  sku:         string;
  quantity:    number;
  unitPrice:   number;
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

  // ── CREATE DRAWER ──────────────────────────────
  createVisible = false;

  form: InvoiceForm = this.emptyForm();

  paymentMethods = ['VNPay', 'COD', 'Momo', 'Banking'];

  // Danh sách khách hàng mẫu để chọn
  customerList = [
    { id: 1, name: 'Nguyễn Văn An',  email: 'an.nguyen@gmail.com',  phone: '0901 234 567', address: '123 Nguyễn Huệ, Q.1, TP.HCM'             },
    { id: 2, name: 'Trần Thị Bình',  email: 'binh.tran@gmail.com',  phone: '0912 345 678', address: '456 Lê Lợi, Q.3, TP.HCM'                  },
    { id: 3, name: 'Lê Văn Cường',   email: 'cuong.le@gmail.com',   phone: '0923 456 789', address: '789 Trần Hưng Đạo, Q.5, TP.HCM'            },
    { id: 4, name: 'Phạm Thị Dung',  email: 'dung.pham@gmail.com',  phone: '0934 567 890', address: '321 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM' },
  ];

  // Sản phẩm mẫu để chọn nhanh
  productList = [
    { name: 'Giày Nike Air Zoom Pegasus', sku: 'RUN-NK-PG-42', price: 850000  },
    { name: 'Áo thun chạy bộ Run Dry',   sku: 'RUN-SHIRT-M',  price: 199000  },
    { name: 'Tất chạy bộ Run 100 x3',    sku: 'RUN-SOCK-M',   price: 79000   },
    { name: 'Balo chạy bộ Trail 10L',    sku: 'RUN-BAG-10L',  price: 890000  },
    { name: 'Kính bơi Nabaiji Ready',    sku: 'GOG-NAB-GRAY', price: 129000  },
    { name: 'Mũ bơi silicon',            sku: 'CAP-SIL-PINK', price: 199000  },
    { name: 'Mũ lưỡi trai Travel 100',   sku: 'SUN-HAT-ONE',  price: 59000   },
    { name: 'Kính mát hiking MH100',     sku: 'SUN-GLASS-BK', price: 99000   },
  ];

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
      items:           [this.emptyItem()],
      shippingFee:     0,
      discount:        0,
      taxPercent:      10,
    };
  }

  private emptyItem(): InvoiceFormItem {
    return { productName: '', sku: '', quantity: 1, unitPrice: 0 };
  }

  // ── COMPUTED TOTALS ────────────────────────────
  get formSubtotal(): number {
    return this.form.items.reduce(
      (s, item) => s + item.quantity * item.unitPrice, 0
    );
  }

  get formTax(): number {
    return Math.round(this.formSubtotal * this.form.taxPercent / 100);
  }

  get formTotal(): number {
    return this.formSubtotal
      + this.form.shippingFee
      - this.form.discount
      + this.formTax;
  }

  // ── OPEN / CLOSE ───────────────────────────────
  openCreate(): void {
    this.form          = this.emptyForm();
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

  // ── CUSTOMER SELECTION ─────────────────────────
  onSelectCustomer(customerId: number): void {
    const cust = this.customerList.find(c => c.id === +customerId);
    if (!cust) return;
    this.form.customerId      = cust.id;
    this.form.customerName    = cust.name;
    this.form.customerEmail   = cust.email;
    this.form.customerPhone   = cust.phone;
    this.form.customerAddress = cust.address;
  }

  // ── ITEMS ──────────────────────────────────────
  addItem(): void {
    this.form.items.push(this.emptyItem());
  }

  removeItem(index: number): void {
    if (this.form.items.length > 1) {
      this.form.items.splice(index, 1);
    }
  }

  onSelectProduct(index: number, productName: string): void {
    const prod = this.productList.find(p => p.name === productName);
    if (!prod) return;
    this.form.items[index].productName = prod.name;
    this.form.items[index].sku         = prod.sku;
    this.form.items[index].unitPrice   = prod.price;
  }

  // ── SAVE ──────────────────────────────────────
  isFormValid(): boolean {
    return !!(
      this.form.customerName &&
      this.form.paymentMethod &&
      this.form.items.length > 0 &&
      this.form.items.every(i => i.productName && i.quantity > 0 && i.unitPrice > 0)
    );
  }

  saveInvoice(): void {
    if (!this.isFormValid()) return;

    const newInvoice: AdminInvoice = {
      id:              `INV-${String(this.invoices().length + 1).padStart(3, '0')}`,
      orderId:         `#DH${String(Date.now()).slice(-4)}`,
      customer:        this.form.customerName,
      initials:        this.form.customerName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase(),
      issueDate:       new Date().toLocaleDateString('vi-VN'),
      dueDate:         this.form.dueDate || '—',
      amount:          this.formTotal,
      paymentMethod:   this.form.paymentMethod,
      status:          'PENDING',
      customerEmail:   this.form.customerEmail,
      customerPhone:   this.form.customerPhone,
      customerAddress: this.form.customerAddress,
      subtotal:        this.formSubtotal,
      shippingFee:     this.form.shippingFee,
      discount:        this.form.discount,
      tax:             this.formTax,
      note:            this.form.note,
      items:           this.form.items.map(i => ({
        productName: i.productName,
        sku:         i.sku,
        quantity:    i.quantity,
        unitPrice:   i.unitPrice,
        totalPrice:  i.quantity * i.unitPrice,
      })),
    };

    this.invoices.update(list => [newInvoice, ...list]);
    this.closeCreate();
  }

  protected readonly Math = Math;
}
