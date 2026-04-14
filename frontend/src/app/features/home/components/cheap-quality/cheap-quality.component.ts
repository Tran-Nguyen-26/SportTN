import { Component } from '@angular/core';

@Component({
  selector: 'app-cheap-quality',
  templateUrl: './cheap-quality.component.html',
  styleUrls: ['./cheap-quality.component.css']
})
export class CheapQualityComponent {
  products = [
    { name: 'Dây nhảy tay cầm xốp', newPrice: 149000, oldPrice: null, brand: 'DECATHLON', rating: 4.6, reviews: 500, label: '', image: 'assets/daynhay.jpg' },
    { name: 'Mũ lưỡi trai du lịch Travel 100 xám trắng', newPrice: 59000, oldPrice: null, brand: 'FORCLAZ', rating: 4.8, reviews: 12342, label: 'SẢN PHẨM MỚI', image: 'assets/mu.jpg' },
    { name: 'Áo thun chạy bộ nữ Run 500 Dry hồng nhạt', newPrice: 199000, oldPrice: 279000, brand: 'KIPRUN', rating: 4.7, reviews: 8000, label: 'GIẢM GIÁ', image: 'assets/aonu.jpg' },
    { name: 'Kính mát hiking chống tia UV MH100', newPrice: 99000, oldPrice: 129000, brand: 'DECATHLON', rating: 4.6, reviews: 3000, label: 'GIẢM GIÁ', image: 'assets/kinhmat.jpg' },
    { name: 'Túi ngủ cắm trại Arpenaz 20° xanh lá', newPrice: 399000, oldPrice: 499000, brand: 'QUECHUA', rating: 4.8, reviews: 2000, label: 'GIẢM GIÁ', image: 'assets/tuingu.jpg' },
    { name: 'Áo thun chạy bộ nam Run 500 Dry xanh dương', newPrice: 199000, oldPrice: 299000, brand: 'KIPRUN', rating: 4.7, reviews: 10000, label: 'GIẢM GIÁ', image: 'assets/aonam.jpg' },
    { name: 'Mũ bơi silicon cho người tóc dài - 500 Hồng', newPrice: 129000, oldPrice: 199000, brand: 'NABAIJI', rating: 4.5, reviews: 1500, label: 'GIẢM GIÁ', image: 'assets/muboi.jpg' }
  ];
}
