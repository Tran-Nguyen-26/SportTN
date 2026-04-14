import { Component } from '@angular/core';

@Component({
  selector: 'app-most-searched',
  templateUrl: './most-searched.component.html',
  styleUrls: ['./most-searched.component.css']
})
export class MostSearchedComponent {
  products = [
    { name: 'Balo & Túi', image: 'assets/balo.jpg' },
    { name: 'Kính Bơi', image: 'assets/kinhboi.jpg' },
    { name: 'Giày chạy bộ', image: 'assets/giaychay.jpg' },
    { name: 'Kính mát', image: 'assets/kinhmat.jpg' },
    { name: 'Tạ Tập Cơ', image: 'assets/ta.jpg' },
    { name: 'Giày leo núi', image: 'assets/giayleo.jpg' },
    { name: 'Tất', image: 'assets/tat.jpg' },
    { name: 'Pickleball', image: 'assets/pickleball.jpg' },
    { name: 'Vợt Cầu Lông', image: 'assets/vot.jpg' },
    { name: 'Băng Bảo Vệ', image: 'assets/bang.jpg' },
    { name: 'Xe đạp trẻ em', image: 'assets/xedap.jpg' }
  ];
}
