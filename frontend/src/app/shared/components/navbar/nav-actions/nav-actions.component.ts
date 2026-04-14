import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-actions',
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.css']
})
export class NavActionsComponent {
  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/login']);
  }

  goCart() {
    this.router.navigate(['/cart']);
  }

  isLoggedIn = false;
  userName = 'Trần Nguyên';
  userEmail = 'trannguyeen2005@gmail.com';
  userPoints = 0;
}
