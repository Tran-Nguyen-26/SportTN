import {Component, Input} from '@angular/core';
import {CategoryResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-sports-popular',
  templateUrl: './sports-popular.component.html',
  styleUrls: ['./sports-popular.component.css']
})
export class SportsPopularComponent {
  @Input() categories: CategoryResponse[] = [];
}
