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

  constructor(
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private  sanitizer: DomSanitizer
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/auth');
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

