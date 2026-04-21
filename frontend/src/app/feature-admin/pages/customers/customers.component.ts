import {Component, computed, signal} from '@angular/core';

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: string;
  initials: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {

  searchQuery = signal('');
  selectedStatus = signal('');

  statusOptions = [
    { value: '',         label: 'Tất cả' },
    { value: 'ACTIVE',   label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
  ];

  customers =  signal<AdminCustomer[]>([
    { id: 1, fullName: 'Nguyễn Văn An',   email: 'an.nguyen@gmail.com',   phone: '0901234567', totalOrders: 12, totalSpent: 4500000,  joinDate: '10/01/2024', status: 'ACTIVE',   initials: 'NA' },
    { id: 2, fullName: 'Trần Thị Bình',   email: 'binh.tran@gmail.com',   phone: '0912345678', totalOrders: 8,  totalSpent: 2800000,  joinDate: '15/02/2024', status: 'ACTIVE',   initials: 'TB' },
    { id: 3, fullName: 'Lê Văn Cường',    email: 'cuong.le@gmail.com',    phone: '0923456789', totalOrders: 3,  totalSpent: 890000,   joinDate: '20/03/2024', status: 'ACTIVE',   initials: 'LC' },
    { id: 4, fullName: 'Phạm Thị Dung',   email: 'dung.pham@gmail.com',   phone: '0934567890', totalOrders: 24, totalSpent: 12400000, joinDate: '05/01/2024', status: 'ACTIVE',   initials: 'PD' },
    { id: 5, fullName: 'Hoàng Văn Em',    email: 'em.hoang@gmail.com',    phone: '0945678901', totalOrders: 1,  totalSpent: 299000,   joinDate: '01/04/2024', status: 'INACTIVE', initials: 'HE' },
    { id: 6, fullName: 'Vũ Thị Phương',   email: 'phuong.vu@gmail.com',   phone: '0956789012', totalOrders: 16, totalSpent: 7200000,  joinDate: '12/02/2024', status: 'ACTIVE',   initials: 'VP' },
    { id: 7, fullName: 'Đặng Văn Quân',   email: 'quan.dang@gmail.com',   phone: '0967890123', totalOrders: 5,  totalSpent: 1900000,  joinDate: '18/03/2024', status: 'ACTIVE',   initials: 'DQ' },
    { id: 8, fullName: 'Bùi Thị Hoa',     email: 'hoa.bui@gmail.com',     phone: '0978901234', totalOrders: 0,  totalSpent: 0,        joinDate: '10/04/2024', status: 'INACTIVE', initials: 'BH' },
  ]);

  // --- STATS COMPUTED ---
  totalCustomers = computed(() => this.customers().length);

  activeCustomers = computed(() =>
    this.customers().filter(c => c.status === 'ACTIVE').length
  );

  totalOrders = computed(() =>
    this.customers().reduce((s, c) => s + c.totalOrders, 0)
  );

  totalRevenueM = computed(() => {
    const total = this.customers().reduce((s, c) => s + c.totalSpent, 0);
    return (total / 1000000).toFixed(1);
  });

  // --- FILTERED LIST ---
  filteredCustomers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();

    return this.customers().filter(c => {
      const matchStatus = !status || c.status === status;
      const matchSearch = !query
        || c.fullName.toLowerCase().includes(query)
        || c.email.toLowerCase().includes(query)
        || c.phone.includes(query);
      return matchStatus && matchSearch;
    });
  });

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getAvatarColor(index: number): string {
    const colors = ['#3b82f6','#16a34a','#ea580c','#7c3aed','#0891b2','#db2777'];
    return colors[index % colors.length];
  }
}
