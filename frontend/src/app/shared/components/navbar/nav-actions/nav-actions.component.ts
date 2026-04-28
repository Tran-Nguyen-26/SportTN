import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../../core/services/auth/auth.service";

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
    this.authService.logout();
  }

}
