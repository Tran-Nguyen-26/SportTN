import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

export interface TopbarNotif {
  id: number;
  type: 'order' | 'stock' | 'payment' | 'review' | 'system';
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}

export interface ProfileForm {
  name: string;
  phone: string;
  title: string;
}

export interface PwdForm {
  current: string;
  newPwd:  string;
  confirm: string;
}

export interface PwdError {
  current: string;
  newPwd:  string;
  confirm: string;
}

export interface PwdStrength {
  label: string;
  class: string;
  width: string;
  score: number;
}

@Component({
  selector:    'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls:   ['./topbar.component.css']
})
export class TopbarComponent {

  @Input() currentLabel: string = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery   = '';
  searchFocused = false;

  // Dropdown open states
  notifOpen    = false;
  settingsOpen = false;
  userOpen     = false;

  // Settings toggles
  darkMode     = false;
  soundEnabled = true;

  profileModalOpen = false;
  pwdModalOpen     = false;
  helpModalOpen    = false;
  helpQuery        = '';

  showCurrentPwd = false;
  showNewPwd     = false;
  showConfirmPwd = false;

  profileForm: ProfileForm = {
    name:  '',
    phone: '',
    title: '',
  };

  pwdForm: PwdForm = {
    current: '',
    newPwd:  '',
    confirm: '',
  };

  pwdError: PwdError = {
    current: '',
    newPwd:  '',
    confirm: '',
  };

  pwdStrength: PwdStrength = {
    label: '', class: '', width: '0%', score: 0
  };

  // ── Observables ───────────────────────────────────────────────────────────
  currentUser$ = this.authService.currentUser$;
  isLoggedIn$  = this.authService.isLoggedIn$;

  // ── Notifications ─────────────────────────────────────────────────────────
  recentNotifs: TopbarNotif[] = [
    {
      id: 1, type: 'order', read: false,
      title:   'Đơn hàng mới #10284',
      body:    'Nguyễn Văn An · 1.250.000đ',
      timeAgo: '5 phút trước',
    },
    {
      id: 2, type: 'stock', read: false,
      title:   'Sắp hết hàng',
      body:    'Kính Bơi TYR Special Ops còn 3',
      timeAgo: '1 giờ trước',
    },
    {
      id: 3, type: 'payment', read: false,
      title:   'Thanh toán thất bại',
      body:    'Đơn #10281 · VNPay từ chối',
      timeAgo: '2 giờ trước',
    },
    {
      id: 4, type: 'review', read: true,
      title:   'Đánh giá mới cần duyệt',
      body:    'Phạm Thu Hà · 2 sao · Áo Nike',
      timeAgo: '4 giờ trước',
    },
    {
      id: 5, type: 'order', read: true,
      title:   'Đơn #10279 đã giao thành công',
      body:    'Lê Minh Khoa · GHN123456',
      timeAgo: '3 giờ trước',
    },
  ];

  // ── Quick links & FAQs ────────────────────────────────────────────────────
  quickLinks = [
    { icon: 'shopping_bag',       color: 'blue',   label: 'Quản lý đơn hàng', guideId: 'orders'    },
    { icon: 'inventory_2',        color: 'green',  label: 'Thêm sản phẩm',    guideId: 'products'  },
    { icon: 'confirmation_number',color: 'orange', label: 'Tạo voucher',       guideId: 'vouchers'  },
    { icon: 'bolt',               color: 'red',    label: 'Flash Sale',        guideId: 'flashsale' },
    { icon: 'view_carousel',      color: 'purple', label: 'Quản lý banner',    guideId: 'banners'   },
    { icon: 'analytics',          color: 'teal',   label: 'Xem báo cáo',       guideId: 'analytics' },
  ];

  faqs = [
    {
      question: 'Làm thế nào để thêm sản phẩm mới?',
      answer:   'Vào tab Sản phẩm → bấm "Thêm sản phẩm" ở góc trên phải → điền đầy đủ thông tin cơ bản, variants và hình ảnh → bấm "Lưu sản phẩm".',
      open: false,
    },
    {
      question: 'Cách xử lý đơn hàng chờ xác nhận?',
      answer:   'Vào tab Đơn hàng → lọc trạng thái "Chờ xác nhận" → click vào đơn cần xử lý → bấm "Xác nhận đơn hàng". Hệ thống sẽ tự động gửi email thông báo đến khách hàng.',
      open: false,
    },
    {
      question: 'Làm sao để tạo mã giảm giá flash sale?',
      answer:   'Có 2 cách: (1) Vào tab Voucher → tạo voucher thông thường với thời gian giới hạn. (2) Vào tab Flash Sale → tạo session mới → thêm sản phẩm và giá sale riêng cho từng khung giờ.',
      open: false,
    },
    {
      question: 'Cách cập nhật tồn kho sản phẩm?',
      answer:   'Vào tab Sản phẩm → tìm sản phẩm cần cập nhật → click "Chỉnh sửa" → chọn tab Variants → sửa trực tiếp số lượng tồn kho tại cột "Tồn kho" của từng variant.',
      open: false,
    },
    {
      question: 'Làm thế nào để thêm nhân viên mới?',
      answer:   'Vào tab Users → bấm "Thêm tài khoản" → nhập thông tin, chọn vai trò → phân quyền chi tiết → bấm "Tạo tài khoản". Nhân viên sẽ nhận email với thông tin đăng nhập.',
      open: false,
    },
    {
      question: 'Cách thay đổi banner trang chủ?',
      answer:   'Vào tab Banners → click "Thêm banner" hoặc icon chỉnh sửa → tải ảnh lên hoặc nhập URL → chọn vị trí → đặt thứ tự hiển thị → lưu.',
      open: false,
    },
    {
      question: 'Xuất báo cáo doanh thu như thế nào?',
      answer:   'Vào tab Analytics → chọn khoảng thời gian → bấm "Xuất báo cáo" → file sẽ được tải về máy.',
      open: false,
    },
    {
      question: 'Làm sao để gửi thông báo đến khách hàng?',
      answer:   'Vào tab Thông báo → bấm "Gửi thông báo" → nhập tiêu đề và nội dung → chọn đối tượng gửi → có thể lên lịch hoặc gửi ngay.',
      open: false,
    },
  ];

  constructor(
    private router:      Router,
    private authService: AuthService
  ) {}

  // ── Current user info ─────────────────────────────────────────────────────

  get currentUserInfo() {
    const user = this.authService.currentUserValue;
    const fullName = user?.username ?? 'Admin';
    const parts    = fullName.trim().split(' ');
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : fullName.substring(0, 2).toUpperCase();

    return {
      name:      fullName,
      email:     user?.email ?? '',
      initials,
      roleLabel: user?.role === 'ADMIN' ? 'Quản trị viên' : (user?.role ?? ''),
      color:     '#7c3aed',
    };
  }

  get unreadNotifs(): number {
    return this.recentNotifs.filter(n => !n.read).length;
  }

  // ── Toggle handlers ───────────────────────────────────────────────────────

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  toggleNotif(): void {
    this.notifOpen    = !this.notifOpen;
    this.settingsOpen = false;
    this.userOpen     = false;
  }

  toggleSettings(): void {
    this.settingsOpen = !this.settingsOpen;
    this.notifOpen    = false;
    this.userOpen     = false;
  }

  toggleUser(): void {
    this.userOpen     = !this.userOpen;
    this.notifOpen    = false;
    this.settingsOpen = false;
  }

  closeAllDropdowns(): void {
    this.notifOpen    = false;
    this.settingsOpen = false;
    this.userOpen     = false;
  }

  // ── Notification actions ──────────────────────────────────────────────────

  getNotifIcon(type: string): string {
    const map: Record<string, string> = {
      order:   'shopping_bag',
      stock:   'inventory_2',
      payment: 'payments',
      review:  'star',
      system:  'settings',
    };
    return map[type] ?? 'notifications';
  }

  markAllRead(): void {
    this.recentNotifs.forEach(n => n.read = true);
  }

  openNotifItem(n: TopbarNotif): void {
    n.read         = true;
    this.notifOpen = false;
    this.router.navigate(['/admin/notifications']);
  }

  goToNotifications(): void {
    this.router.navigate(['/admin/notifications']);
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  goToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  logout(): void {
    this.userOpen = false;
    this.authService.logout();
  }

  // ── Profile modal ─────────────────────────────────────────────────────────

  openProfile(): void {
    this.profileForm = {
      name:  this.currentUserInfo.name,
      phone: '',
      title: this.currentUserInfo.roleLabel,
    };
    this.profileModalOpen = true;
    this.userOpen         = false;
  }

  saveProfile(): void {
    if (!this.profileForm.name) return;
    this.profileModalOpen = false;
    // TODO: gọi API update profile
  }

  onProfileOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.profileModalOpen = false;
    }
  }

  // ── Password modal ────────────────────────────────────────────────────────

  openPwdModal(): void {
    this.pwdForm      = { current: '', newPwd: '', confirm: '' };
    this.pwdError     = { current: '', newPwd: '', confirm: '' };
    this.pwdStrength  = { label: '', class: '', width: '0%', score: 0 };
    this.showCurrentPwd = false;
    this.showNewPwd     = false;
    this.showConfirmPwd = false;
    this.pwdModalOpen   = true;
    this.userOpen       = false;
  }

  closePwdModal(): void {
    this.pwdModalOpen = false;
  }

  onPwdOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closePwdModal();
    }
  }

  checkPwdStrength(pwd: string): void {
    let score = 0;
    if (pwd.length >= 8)           score++;
    if (pwd.length >= 12)          score++;
    if (/[A-Z]/.test(pwd))        score++;
    if (/[0-9]/.test(pwd))        score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const map: Record<number, PwdStrength> = {
      0: { label: 'Rất yếu',   class: 'very-weak',   width: '10%',  score: 0 },
      1: { label: 'Yếu',       class: 'weak',         width: '25%',  score: 1 },
      2: { label: 'Trung bình',class: 'fair',          width: '50%',  score: 2 },
      3: { label: 'Khá',       class: 'good',          width: '70%',  score: 3 },
      4: { label: 'Mạnh',      class: 'strong',        width: '85%',  score: 4 },
      5: { label: 'Rất mạnh',  class: 'very-strong',  width: '100%', score: 5 },
    };
    this.pwdStrength = map[score] ?? map[0];
  }

  isPwdFormValid(): boolean {
    return !!(
      this.pwdForm.current &&
      this.pwdForm.newPwd.length >= 8 &&
      this.pwdForm.confirm === this.pwdForm.newPwd
    );
  }

  savePassword(): void {
    this.pwdError = { current: '', newPwd: '', confirm: '' };
    let valid = true;

    if (!this.pwdForm.current) {
      this.pwdError.current = 'Vui lòng nhập mật khẩu hiện tại';
      valid = false;
    }
    if (this.pwdForm.newPwd.length < 8) {
      this.pwdError.newPwd = 'Mật khẩu phải có ít nhất 8 ký tự';
      valid = false;
    }
    if (this.pwdForm.newPwd === this.pwdForm.current) {
      this.pwdError.newPwd = 'Mật khẩu mới phải khác mật khẩu hiện tại';
      valid = false;
    }
    if (this.pwdForm.confirm !== this.pwdForm.newPwd) {
      this.pwdError.confirm = 'Mật khẩu xác nhận không khớp';
      valid = false;
    }
    if (!valid) return;

    this.closePwdModal();
    // TODO: gọi API đổi mật khẩu
  }

  // ── Help modal ────────────────────────────────────────────────────────────

  openHelp(): void {
    this.helpQuery     = '';
    this.faqs.forEach(f => f.open = false);
    this.helpModalOpen = true;
    this.settingsOpen  = false;
  }

  onHelpOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.helpModalOpen = false;
    }
  }

  openGuide(q: { guideId: string; label: string }): void {
    const map: Record<string, string> = {
      orders:    'Làm thế nào để thêm sản phẩm mới?',
      products:  'Làm thế nào để thêm sản phẩm mới?',
      vouchers:  'Làm sao để tạo mã giảm giá flash sale?',
      flashsale: 'Làm sao để tạo mã giảm giá flash sale?',
      banners:   'Cách thay đổi banner trang chủ?',
      analytics: 'Xuất báo cáo doanh thu như thế nào?',
    };
    const target = map[q.guideId];
    if (target) {
      const faq = this.faqs.find(f => f.question === target);
      if (faq) {
        this.faqs.forEach(f => f.open = false);
        faq.open = true;
      }
    }
  }

  get filteredFaqs() {
    const q = this.helpQuery.toLowerCase().trim();
    if (!q) return this.faqs;
    return this.faqs.filter(f =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  }
}
