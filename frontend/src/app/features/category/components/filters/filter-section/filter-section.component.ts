import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.css']
})
export class FilterSectionComponent {
  @Input() title!: string;
  @Input() items: { label: string; count: number }[] = [];

  showAll = false;

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  get visibleItems() {
    return this.showAll ? this.items : this.items.slice(0, 5);
  }
}
