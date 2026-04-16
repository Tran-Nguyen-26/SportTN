import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.css']
})
export class RatingStarsComponent {
  @Input() rating: number = 0;

  get stars(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isFilledStar(star: number): boolean {
    return star <= Math.floor(this.rating);
  }

  isHalfFilledStar(star: number): boolean {
    return star === Math.ceil(this.rating) && this.rating % 1 !== 0;
  }
}
