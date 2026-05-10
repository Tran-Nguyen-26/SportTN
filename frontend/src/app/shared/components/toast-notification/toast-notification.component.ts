import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => {
      this.close.emit();
    }, 2000);
  }
}
