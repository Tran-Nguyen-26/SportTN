import { Component } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css']
})
export class PriceFilterComponent {
  minPrice = 20000;
  maxPrice = 19999000;

  selectedMin = this.minPrice;
  selectedMax = this.maxPrice;
  appliedMin = this.minPrice;
  appliedMax = this.maxPrice;

  updateMin(event: any) {
    this.selectedMin = Number(event.target.value);
    if (this.selectedMin > this.selectedMax) {
      this.selectedMax = this.selectedMin;
    }
  }

  updateMax(event: any) {
    this.selectedMax = Number(event.target.value);
    if (this.selectedMax < this.selectedMin) {
      this.selectedMin = this.selectedMax;
    }
  }

  applyPriceRange(): void {
    this.appliedMin = this.selectedMin;
    this.appliedMax = this.selectedMax;
  }

  resetPriceRange(): void {
    this.selectedMin = this.minPrice;
    this.selectedMax = this.maxPrice;
    this.appliedMin = this.minPrice;
    this.appliedMax = this.maxPrice;
  }
}
