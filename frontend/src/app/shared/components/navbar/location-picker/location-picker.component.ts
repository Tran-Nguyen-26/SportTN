import { Component } from '@angular/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css']
})
export class LocationPickerComponent {
  isOpen = false;
  selectedLocation = 'Hà Nội';
  locations = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng'
  ];

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  selectLocation(location: string): void {
    this.selectedLocation = location;
    this.isOpen = false;
  }
}
