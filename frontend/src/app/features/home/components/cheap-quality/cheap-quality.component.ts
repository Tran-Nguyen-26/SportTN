import {Component, Input} from '@angular/core';
import {ProductCardResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-cheap-quality',
  templateUrl: './cheap-quality.component.html',
  styleUrls: ['./cheap-quality.component.css']
})
export class CheapQualityComponent {
  @Input() products: ProductCardResponse[] = [];
}
