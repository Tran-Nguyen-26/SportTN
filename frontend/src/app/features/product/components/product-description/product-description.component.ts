// product-description.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent {
  @Input() description = '';
  expanded = false;

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}
