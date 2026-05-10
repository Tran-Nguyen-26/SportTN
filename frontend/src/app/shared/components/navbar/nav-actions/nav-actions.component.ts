import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../../core/services/auth/auth.service";
import {UserResponse} from "../../../../core/models/auth/auth.model";
import {AdminUser} from "../../../../feature-admin/pages/users/users.component";

@Component({
  selector: 'app-nav-actions',
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.css']
})
export class NavActionsComponent {
  cartCount = 2;

  constructor(private router: Router, private authService: AuthService) {}

  currentUser$ = this.authService.currentUser$;
  isLoggedIn$ = this.authService.isLoggedIn$;

  goLogin() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    } else {
      console.log('Bạn đã đăng nhập.');
    }
  }

  goCart() {
    this.router.navigate(['/cart']);
  }

  goToAccount() {
    this.router.navigate(['/account/my-account']);
  }

  handleLogout(): void {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');

    if (confirmLogout) {
      this.authService.logout();

      // Hiển thị toast thông báo nếu muốn
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Đăng xuất thành công!', type: 'success' }
      });
      window.dispatchEvent(event);
    }
  }

  isCustomer(user: UserResponse | AdminUser): user is UserResponse {
    return (user as UserResponse).totalPoints !== undefined;
  }


}
