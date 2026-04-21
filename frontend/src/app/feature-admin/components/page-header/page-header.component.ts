import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() btnLabel: string = '';
  @Input() btnIcon: string = 'add';

  @Output() btnClick = new EventEmitter<void>();

  onCLick() {
    this.btnClick.emit();
  }
}
