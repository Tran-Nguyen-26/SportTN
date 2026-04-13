import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-menu-item',
  templateUrl: './nav-menu-item.component.html',
  styleUrls: ['./nav-menu-item.component.css']
})
export class NavMenuItemComponent {
  @Input() label: string = '';
  @Input() isActive: boolean = false;
  @Input() highlight: 'new' | 'sale' | null =  null;
  @Input() hasChildren: boolean = false;
}
