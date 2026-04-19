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

  updateMin(event: any) {
    this.selectedMin = event.target.value;
  }

  updateMax(event: any) {
    this.selectedMax = event.target.value;
  }
}
