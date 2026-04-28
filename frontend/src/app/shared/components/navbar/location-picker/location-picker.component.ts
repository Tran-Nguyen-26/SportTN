import { Component } from '@angular/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css']
})
export class LocationPickerComponent {
  isOpen = false;
  selectedLocation = 'TP. Ho Chi Minh';
  locations = [
    'TP. Ho Chi Minh',
    'Ha Noi',
    'Da Nang',
    'Can Tho',
    'Hai Phong'
  ];

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  selectLocation(location: string): void {
    this.selectedLocation = location;
    this.isOpen = false;
  }
}
