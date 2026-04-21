import {Component, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

  @Input() currentLabel: string = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery = '';

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
