import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Order, OrderStatus } from 'src/app/core/models/order/order.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['orderId', 'date', 'items', 'totalPrice', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  isLoading = false;
  selectedOrder: Order | null = null;
  showDetails = false;

  statusColors: { [key in OrderStatus]: string } = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
  };

  constructor() { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders(): void {
    this.isLoading = true;
    // Mock data - Replace with OrderService.getOrders()
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          userId: '1',
          items: [
            {
              id: '1',
              product: {
                id: '1',
                name: 'Nike Sports Shoes',
                description: 'High-quality sports shoes',
                price: 120,
                image: 'assets/images/products/shoes.jpg',
                rating: 4.5,
                reviews: 120,
                stock: 10,
                brand: 'Nike',
                category: { id: 1, name: 'Shoes', image: 'assets/images/shoes.jpg' }
              },
              quantity: 1,
              price: 120
            }
          ],
          totalPrice: 220,
          status: OrderStatus.DELIVERED,
          deliveryAddress: {
            id: '1',
            name: 'Home',
            phoneNumber: '+84905123456',
            address: '123 Main Street',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India'
          },
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15'
        },
        {
          id: 'ORD-002',
          userId: '1',
          items: [
            {
              id: '2',
              product: {
                id: '2',
                name: 'Adidas Sports Shirt',
                description: 'Comfortable sports shirt',
                price: 50,
                image: 'assets/images/products/shirt.jpg',
                rating: 4.2,
                reviews: 85,
                stock: 15,
                brand: 'Adidas',
                category: { id: 2, name: 'Shirts', image: 'assets/images/shirts.jpg' }
              },
              quantity: 2,
              price: 100
            }
          ],
          totalPrice: 118,
          status: OrderStatus.SHIPPED,
          deliveryAddress: {
            id: '1',
            name: 'Home',
            phoneNumber: '+84905123456',
            address: '123 Main Street',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001',
            country: 'India'
          },
          paymentMethod: 'Debit Card',
          createdAt: '2024-01-20'
        }
      ];
      this.dataSource.data = mockOrders;
      this.isLoading = false;
    }, 500);
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedOrder = null;
  }

  cancelOrder(order: Order): void {
    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) {
      order.status = OrderStatus.CANCELLED;
    }
  }

  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'check_circle';
      case OrderStatus.SHIPPED:
        return 'local_shipping';
      case OrderStatus.CONFIRMED:
        return 'shopping_cart';
      case OrderStatus.PENDING:
        return 'schedule';
      case OrderStatus.CANCELLED:
        return 'cancel';
      case OrderStatus.RETURNED:
        return 'assignment_return';
      default:
        return 'info';
    }
  }

  retryPayment(): void {
    // Implement retry payment logic
  }

  downloadInvoice(): void {
    // Implement download invoice logic
  }
}
