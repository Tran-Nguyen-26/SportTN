import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  // Biến kiểm soát việc hiển thị Mega Menu Search
  isSearchFocus: boolean = false;

  sampleProduct = {
    id: 101,
    name: 'Kính bơi Ready xám',
    slug: '',
    mainImageUrl: 'assets/kinhboi.jpg', // Tên trường mới
    brandName: 'DECATHLON',             // Tên trường mới
    rating: 4.5,
    reviewCount: 115,                   // Tên trường mới
    soldCount: 500,                     // Thêm trường số lượng đã bán
    originalPrice: 100000,              // Giá gốc (số)
    salePrice: 69000,                   // Giá đang giảm
    effectivePrice: 69000,              // Giá thực tế cuối cùng
    discountPercent: 31,                // % giảm giá
    isOnSale: true,                     // Trạng thái giảm giá
    isNew: true,                        // Trạng thái hàng mới
    isBestSeller: false                 // Trạng thái bán chạy
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
