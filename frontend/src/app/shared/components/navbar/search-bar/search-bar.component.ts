import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  // Biến kiểm soát việc hiển thị Mega Menu Search
  isSearchFocus: boolean = false;

  swimProduct = {
    name: 'Kính bơi Ready xám',
    newPrice: 69000,
    oldPrice: null,
    brand: 'DECATHLON',
    rating: 4.5,
    reviews: 115,
    label: 'MỚI',
    image: 'assets/kinhboi.jpg'
  };

  // Nếu bạn muốn báo cho Navbar biết để làm mờ Header, có thể dùng Output
  @Output() searchStateChange = new EventEmitter<boolean>();

  /**
   * Khi người dùng nhấn vào ô input
   */
  onFocus(): void {
    this.isSearchFocus = true;
    this.searchStateChange.emit(true);
  }

  /**
   * Khi người dùng nhấn ra ngoài ô input
   */
  onBlur(): void {
    // Sử dụng setTimeout (khoảng 200ms) để đảm bảo nếu người dùng
    // click vào một kết quả tìm kiếm, sự kiện click đó vẫn được ghi nhận
    // trước khi Overlay bị gỡ bỏ khỏi DOM.
    setTimeout(() => {
      this.isSearchFocus = false;
      this.searchStateChange.emit(false);
    }, 200);
  }

  /**
   * Hàm đóng search thủ công (Ví dụ khi nhấn nút X)
   */
  closeSearch(): void {
    this.isSearchFocus = false;
    this.searchStateChange.emit(false);
  }

  /**
   * Logic xử lý khi chọn một mục tìm kiếm (demo)
   */
  selectItem(item: string): void {
    console.log('Đang tìm kiếm cho:', item);
    this.closeSearch();
    // Điều hướng (Router) hoặc gọi API search tại đây
  }
}
