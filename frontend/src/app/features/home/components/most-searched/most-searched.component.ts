import {Component, Input} from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";
import {Router} from "@angular/router";

@Component({
  selector: 'app-most-searched',
  templateUrl: './most-searched.component.html',
  styleUrls: ['./most-searched.component.css']
})
export class MostSearchedComponent {
  @Input() title: string = '';
  @Input() products: ProductCardResponse[] = [];

  constructor(private router: Router) {
  }

  gotToProductPage(slug: string) {
    this.router.navigate(['/product', slug]);
  }
}
