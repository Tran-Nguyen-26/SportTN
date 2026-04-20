import {Component, Input} from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent {
  @Input() products: ProductCardResponse[] = [];
}
