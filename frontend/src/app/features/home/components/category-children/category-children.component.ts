import {Component, Input} from '@angular/core';
import {CategoryResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-category-children',
  templateUrl: './category-children.component.html',
  styleUrls: ['./category-children.component.css']
})
export class CategoryChildrenComponent {
  @Input() childrenCategories: CategoryResponse[] = [];
}
