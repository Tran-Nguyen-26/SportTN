import { Component } from '@angular/core';

@Component({
  selector: 'app-sports-popular',
  templateUrl: './sports-popular.component.html',
  styleUrls: ['./sports-popular.component.css']
})
export class SportsPopularComponent {
  sports = [
    { name: 'Chạy Bộ', image: 'assets/chaybo.jpg' },
    { name: 'Bơi Lội', image: 'assets/boiloi.jpg' },
    { name: 'Cardio & Thể Hình', image: 'assets/cardio.jpg' },
    { name: 'Leo Núi & Cắm Trại', image: 'assets/leonui.jpg' },
    { name: 'Pickleball', image: 'assets/pickleball.jpg' },
    { name: 'Đạp Xe', image: 'assets/dapxe.jpg' },
    { name: 'Yoga/Pilates', image: 'assets/yoga.jpg' },
    { name: 'Cầu Lông', image: 'assets/caulong.jpg' },
    { name: 'Đá Bóng', image: 'assets/dabong.jpg' },
    { name: 'Bóng Rổ', image: 'assets/bongro.jpg' },
    { name: 'Trượt Patin', image: 'assets/patin.jpg' },
    { name: 'Golf', image: 'assets/golf.jpg' }
  ];
}
