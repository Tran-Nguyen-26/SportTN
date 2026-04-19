import { Component, Input } from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 40; // Độ lớn của vòng xoay
  @Input() message: string = '';  // Dòng chữ đi kèm (nếu có)
  @Input() overlay: boolean = false; // Có làm mờ cả màn hình không
}
