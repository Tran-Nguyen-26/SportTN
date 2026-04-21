import {Component, Input} from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-most-searched',
  templateUrl: './most-searched.component.html',
  styleUrls: ['./most-searched.component.css']
})
export class MostSearchedComponent {
  @Input() title: string = '';
  @Input() products: ProductCardResponse[] = [];
}
