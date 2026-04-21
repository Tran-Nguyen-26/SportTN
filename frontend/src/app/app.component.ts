import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthPage = false;
  isAdminPage = false;

  constructor(
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private  sanitizer: DomSanitizer
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/auth');
        this.isAdminPage = event.url.includes('/admin');
      }

      if (this.isAdminPage) {
        document.body.classList.add('admin-mode');
        document.body.classList.remove('normal-mode');
      } else {
        document.body.classList.add('normal-mode');
        document.body.classList.remove('admin-mode');
      }
    });

    this.iconRegistry.addSvgIcon(
      'google',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg')
    );
    this.iconRegistry.addSvgIcon(
      'facebook',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
    );
    this.iconRegistry.addSvgIcon(
      'apple',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/apple.svg')
    );
  }
}

