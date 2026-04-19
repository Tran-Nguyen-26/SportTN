import { Component } from '@angular/core';
import {
  BannerResponse, CategoryResponse,
  CategorySectionResponse,
  ProductCardResponse
} from "../../../../core/models/home-response/home-response";
import {HomeService} from "../../../../core/services/home/home.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  swimBanners = [
    { title: 'Kính bơi', image: 'assets/banner-swim-goggles.webp' },
    { title: 'Đồ bơi', image: 'assets/banner-swim-goggles.webp' },
    { title: 'Phụ kiện bơi', image: 'assets/banner-swim-goggles.webp' }
  ];
  swimProducts = [
    { name: 'Kính bơi Ready xám', newPrice: 69000, oldPrice: null, brand: 'DECATHLON', rating: 4.5, reviews: 115, label: 'MỚI', image: 'assets/kinhboi.jpg' },
    { name: 'Mũ bơi silicon tóc dài', newPrice: 129000, oldPrice: 199000, brand: 'NABAIJI', rating: 4.5, reviews: 1500, label: 'GIẢM GIÁ', image: 'assets/muboi.jpg' }
  ];

  runBanners = [
    { title: 'Giày chạy bộ', image: 'assets/banner-run-shoes.jpg' },
    { title: 'Áo thun chạy bộ', image: 'assets/banner-run-shirt.jpg' },
    { title: 'Phụ kiện chạy', image: 'assets/banner-run-accessories.jpg' }
  ];
  runProducts = [
    { name: 'Áo thun chạy bộ nam Dry 100', newPrice: 99000, oldPrice: null, brand: 'DECATHLON', rating: 4.7, reviews: 25202, label: 'BÁN CHẠY', image: 'assets/aonam.jpg' },
    { name: 'Áo thun chạy bộ nữ Dry 500', newPrice: 199000, oldPrice: 279000, brand: 'KIPRUN', rating: 4.7, reviews: 8000, label: 'GIẢM GIÁ', image: 'assets/aonu.jpg' }
  ];

  sunBanners = [
    { title: 'Kính mát chống UV', image: 'assets/banner-sunglasses.jpg' },
    { title: 'Áo chống nắng', image: 'assets/banner-sun-shirt.jpg' },
    { title: 'Mũ chống nắng', image: 'assets/banner-sun-hat.jpg' }
  ];
  sunProducts = [
    { name: 'Kính mát hiking MH100', newPrice: 99000, oldPrice: 129000, brand: 'DECATHLON', rating: 4.6, reviews: 3000, label: 'GIẢM GIÁ', image: 'assets/kinhmat.jpg' },
    { name: 'Áo chống nắng trekking', newPrice: 299000, oldPrice: 399000, brand: 'QUECHUA', rating: 4.8, reviews: 1200, label: 'GIẢM GIÁ', image: 'assets/aochongnang.jpg' }
  ];

  heroBanners: BannerResponse[] = [];

  categories: CategoryResponse[] = [];

  sportsPopular: CategoryResponse[] = [];

  categorySections: CategorySectionResponse[] = [];

  mostSearched: ProductCardResponse[] = [];

  cheapQuality: ProductCardResponse[] = [];

  bestSellers: ProductCardResponse[] = [];

  constructor(private homeService: HomeService) {
  }

  ngOnInit() {
    this.homeService.getHomeData().subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data;
          this.heroBanners = data.heroBanners;
          this.categories = data.categories;
          this.sportsPopular = data.sportsPopular;
          this.categorySections = data.categorySections;
          this.mostSearched = data.mostSearched;
          this.cheapQuality = data.cheapQuality;
          this.bestSellers = data.bestSellers;

          console.log('Home data loaded: ', data);
        }
      },
      error: (err) => console.error('Lỗi khi load trong Home', err)
    });
  }
}
