import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user/user.model';
import {AuthService} from "../../../../core/services/auth/auth.service";
import {map} from "rxjs";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {

  menuItems = [
    { label: 'Tài khoản', icon: 'person', routerLink: '/account/my-account' },
    { label: 'Địa chỉ của tôi', icon: 'location_on', routerLink: '/account/address' },
    { label: 'Lịch sử mua hàng', icon: 'history', routerLink: '/account/order-history' },
    { label: 'Thẻ thành viên', icon: 'account_balance_wallet', routerLink: '/account/wallet' },
    { label: 'Yêu thích', icon: 'favorite', routerLink: '/account/wishlist' },
    { label: 'Thông báo', icon: 'notifications', routerLink: '/account/notification' },
    { label: 'Trung tâm hỗ trợ', icon: 'help', routerLink: '/account/help' }
  ];

  constructor(private router: Router, private authService: AuthService) { }

  user$ = this.authService.currentUser$.pipe(
    map(auth => auth?.userResponse || null)
  );

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

  getInitials(username: string | undefined): string {
    if (!username) return 'TN';
    return username.substring(0, 2).toUpperCase();
  }
}
