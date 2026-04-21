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
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {

  searchQuery  = signal('');
  selectedStatus = signal('');

  statusOptions = [
    { value: '',       label: 'Tất cả' },
    { value: 'PAID',   label: 'Đã thanh toán' },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'OVERDUE', label: 'Quá hạn' },
  ];

  invoices = signal<AdminInvoice[]>([
    { id: 'INV-001', orderId: '#DH001', customer: 'Nguyễn Văn An',  initials: 'NA', issueDate: '01/04/2025', dueDate: '08/04/2025', amount: 1200000,  paymentMethod: 'VNPay',    status: 'PAID'    },
    { id: 'INV-002', orderId: '#DH002', customer: 'Trần Thị Bình',  initials: 'TB', issueDate: '02/04/2025', dueDate: '09/04/2025', amount: 450000,   paymentMethod: 'COD',      status: 'PENDING' },
    { id: 'INV-003', orderId: '#DH003', customer: 'Lê Văn Cường',   initials: 'LC', issueDate: '28/03/2025', dueDate: '04/04/2025', amount: 890000,   paymentMethod: 'Momo',     status: 'OVERDUE' },
    { id: 'INV-004', orderId: '#DH004', customer: 'Phạm Thị Dung',  initials: 'PD', issueDate: '03/04/2025', dueDate: '10/04/2025', amount: 79000,    paymentMethod: 'VNPay',    status: 'PAID'    },
    { id: 'INV-005', orderId: '#DH005', customer: 'Hoàng Văn Em',   initials: 'HE', issueDate: '04/04/2025', dueDate: '11/04/2025', amount: 2400000,  paymentMethod: 'Banking',  status: 'PAID'    },
    { id: 'INV-006', orderId: '#DH006', customer: 'Vũ Thị Phương',  initials: 'VP', issueDate: '27/03/2025', dueDate: '03/04/2025', amount: 340000,   paymentMethod: 'COD',      status: 'OVERDUE' },
    { id: 'INV-007', orderId: '#DH007', customer: 'Đặng Văn Quân',  initials: 'DQ', issueDate: '05/04/2025', dueDate: '12/04/2025', amount: 129000,   paymentMethod: 'Momo',     status: 'PENDING' },
    { id: 'INV-008', orderId: '#DH008', customer: 'Bùi Thị Hoa',    initials: 'BH', issueDate: '06/04/2025', dueDate: '13/04/2025', amount: 5800000,  paymentMethod: 'Banking',  status: 'PAID'    },
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
}
