import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {
  user: User | null = null;

  menuItems = [
    { label: 'My Account', icon: 'person', routerLink: '/account/my-account' },
    { label: 'My Addresses', icon: 'location_on', routerLink: '/account/address' },
    { label: 'Order History', icon: 'history', routerLink: '/account/order-history' },
    { label: 'Wallet', icon: 'account_balance_wallet', routerLink: '/account/wallet' },
    { label: 'My Wishlists', icon: 'favorite', routerLink: '/account/wishlists' },
    { label: 'Notifications', icon: 'notifications', routerLink: '/account/notifications' },
    { label: 'Help Center', icon: 'help', routerLink: '/account/help' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Mock user data - Replace with UserService.getProfile()
    this.user = {
      id: '1',
      email: 'user@example.com',
      firstName: 'Nguyễn',
      lastName: 'Trần'
    };
  }

  logout(): void {
    // Clear local storage and navigate to login
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }

  getInitials(): string {
    if (this.user) {
      return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
    }
    return 'NT';
  }
}
