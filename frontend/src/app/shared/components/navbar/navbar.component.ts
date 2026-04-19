import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showCategoryBanner = false;
  selectedCategoryId: string | null = null;

  onSelectCategory(categoryId: string | null) {
    if (categoryId) {
      if (this.selectedCategoryId === categoryId && this.showCategoryBanner) {
        this.closeCategoryBanner();
      } else {
        this.selectedCategoryId = categoryId;
        this.showCategoryBanner = true;
      }
    } else {
      this.closeCategoryBanner();
    }
  }

  closeCategoryBanner() {
    this.showCategoryBanner = false;
    this.selectedCategoryId = null;
  }

  onBannerClose() {
    this.closeCategoryBanner();
  }
}
