import { Component, OnInit, ViewChild, AfterViewInit, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";


export interface OrderItem {
  id: string;
  product: ProductCardResponse;
  quantity: number;
  price: number; // Giá tại thời điểm mua
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  showDetails = false;
  selectedOrder = signal<any | null>(null); // Dùng Signal cho selectedOrder để tối ưu UI

  constructor() { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders(): void {
    this.isLoading = true;

    // Mock data chuẩn hóa theo ProductCardResponse
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-STN-2026-001',
          items: [
            {
              id: 'ITM-01',
              product: {
                id: 101,
                name: 'Giày Tennis Adidas Barricade 13',
                slug: 'giay-tennis-adidas-barricade-13',
                mainImageUrl: 'assets/images/adidas-barricade.jpg',
                brandName: 'Adidas',
                effectivePrice: 3200000,
                // ... các trường khác từ ProductCardResponse
              },
              quantity: 1,
              price: 3200000
            }
          ],
          totalPrice: 3200000,
          status: OrderStatus.DELIVERED,
          deliveryAddress: {
            name: 'Trần Thành Nguyên',
            phoneNumber: '0905123456',
            address: 'Đại học Bách Khoa',
            city: 'TP. Hồ Chí Minh'
          },
          createdAt: new Date('2026-04-10T10:00:00')
        }
      ];
      this.dataSource.data = mockOrders;
      this.isLoading = false;
    }, 800);
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder.set(order);
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedOrder.set(null);
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      [OrderStatus.DELIVERED]: 'inventory_2',
      [OrderStatus.SHIPPED]: 'local_shipping',
      [OrderStatus.CONFIRMED]: 'verified',
      [OrderStatus.PENDING]: 'schedule',
      [OrderStatus.CANCELLED]: 'cancel',
      [OrderStatus.RETURNED]: 'assignment_return'
    };
    return icons[status] || 'info';
  }

  downloadInvoice(): void {
    console.log('Đang xuất hóa đơn cho đơn hàng:', this.selectedOrder()?.id);
  }
}
