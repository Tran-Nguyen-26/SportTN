import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery = '';

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
