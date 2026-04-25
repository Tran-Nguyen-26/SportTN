import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  activeTab = 'general';

  tabs = [
    { value: 'general',      label: 'Cài đặt chung',    icon: 'settings'           },
    { value: 'store',        label: 'Cửa hàng',          icon: 'storefront'         },
    { value: 'payment',      label: 'Thanh toán',         icon: 'payment'            },
    { value: 'shipping',     label: 'Vận chuyển',         icon: 'local_shipping'     },
    { value: 'notification', label: 'Thông báo',          icon: 'notifications'      },
    { value: 'security',     label: 'Bảo mật',            icon: 'security'           },
  ];

  // ── GENERAL ───────────────────────────────────
  general = {
    siteName:     'SportZone',
    siteUrl:      'https://sportzone.vn',
    description:  'Hệ thống bán hàng thể thao chính hãng',
    contactEmail: 'support@sportzone.vn',
    contactPhone: '1800 1234',
    address:      '123 Nguyễn Huệ, Quận 1, TP.HCM',
    language:     'vi',
    currency:     'VND',
    timezone:     'Asia/Ho_Chi_Minh',
    dateFormat:   'DD/MM/YYYY',
    maintenanceMode: false,
  };

  languages = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' },
  ];

  currencies = [
    { value: 'VND', label: 'VND — Đồng Việt Nam' },
    { value: 'USD', label: 'USD — US Dollar' },
  ];

  dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  // ── STORE ─────────────────────────────────────
  store = {
    logoUrl:          '',
    faviconUrl:       '',
    bannerUrl:        '',
    freeShipThreshold: 350000,
    maxReturnDays:    30,
    warrantyMonths:   12,
    taxPercent:       10,
    lowStockAlert:    10,
    allowReview:      true,
    requireLoginBuy:  false,
    showOutOfStock:   true,
  };

  logoPreview:    string | null = null;
  faviconPreview: string | null = null;

  // ── PAYMENT ───────────────────────────────────
  paymentMethods = [
    {
      id:      'cod',
      name:    'COD — Thanh toán khi nhận hàng',
      icon:    'local_shipping',
      enabled:  true,
      fee:      0,
    },
    {
      id:      'vnpay',
      name:    'VNPay',
      icon:    'credit_card',
      enabled:  true,
      fee:      0,
      merchantId:  'SPORTZONE01',
      secretKey:   '••••••••••••',
    },
    {
      id:      'momo',
      name:    'MoMo',
      icon:    'account_balance_wallet',
      enabled:  true,
      fee:      0,
      partnerId:   'SPORTZONE',
      secretKey:   '••••••••••••',
    },
    {
      id:      'banking',
      name:    'Chuyển khoản ngân hàng',
      icon:    'account_balance',
      enabled:  false,
      bankName:    'Vietcombank',
      accountNo:   '1234567890',
      accountName: 'CONG TY SPORTZONE',
    },
  ];

  expandedPayment: string | null = null;

  togglePaymentExpand(id: string): void {
    this.expandedPayment = this.expandedPayment === id ? null : id;
  }

  // ── SHIPPING ──────────────────────────────────
  shippingProviders = [
    {
      id:      'ghn',
      name:    'Giao Hàng Nhanh (GHN)',
      icon:    '🚚',
      enabled:  true,
      apiKey:   '••••••••',
      shopId:   '123456',
      feeBase:  25000,
    },
    {
      id:      'ghtk',
      name:    'Giao Hàng Tiết Kiệm (GHTK)',
      icon:    '📦',
      enabled:  true,
      apiKey:   '••••••••',
      feeBase:  22000,
    },
    {
      id:      'vnpost',
      name:    'VNPost',
      icon:    '📮',
      enabled:  false,
      apiKey:   '',
      feeBase:  30000,
    },
  ];

  shippingZones = [
    { zone: 'Nội thành HCM',   fee: 25000,  days: '1-2' },
    { zone: 'Ngoại thành HCM', fee: 35000,  days: '2-3' },
    { zone: 'Hà Nội',          fee: 35000,  days: '2-3' },
    { zone: 'Miền Trung',      fee: 45000,  days: '3-4' },
    { zone: 'Miền Bắc khác',   fee: 50000,  days: '3-5' },
    { zone: 'Tây Nguyên',      fee: 55000,  days: '4-5' },
  ];

  // ── NOTIFICATION ──────────────────────────────
  notifications = {
    // Email
    emailNewOrder:        true,
    emailOrderShipped:    true,
    emailOrderCompleted:  true,
    emailOrderCancelled:  true,
    emailLowStock:        true,
    emailNewReview:       false,
    emailNewUser:         false,

    // Push
    pushNewOrder:         true,
    pushLowStock:         true,
    pushNewReview:        false,

    // SMS
    smsEnabled:           false,
    smsPhone:             '',

    // Email config
    smtpHost:   'smtp.gmail.com',
    smtpPort:   587,
    smtpUser:   'no-reply@sportzone.vn',
    smtpPass:   '••••••••',
  };
  //
  // // Định nghĩa kiểu Record để TypeScript cho phép truy cập qua key string
  // notifications: Record<string, any> = {
  //   // Email
  //   emailNewOrder:        true,
  //   emailOrderShipped:    true,
  //   emailOrderCompleted:  true,
  //   emailOrderCancelled:  true,
  //   emailLowStock:        true,
  //   emailNewReview:       false,
  //   emailNewUser:         false,
  //
  //   // Push
  //   pushNewOrder:         true,
  //   pushLowStock:         true,
  //   pushNewReview:        false,
  //
  //   // SMS
  //   smsEnabled:           false,
  //   smsPhone:             '',
  //
  //   // Email config
  //   smtpHost:   'smtp.gmail.com',
  //   smtpPort:   587,
  //   smtpUser:   'no-reply@sportzone.vn',
  //   smtpPass:   '••••••••',
  // };

  // ── SECURITY ──────────────────────────────────
  security = {
    twoFactor:          false,
    sessionTimeout:     60,
    maxLoginAttempts:   5,
    passwordMinLength:  8,
    requireUppercase:   true,
    requireNumber:      true,
    requireSpecial:     false,
    ipWhitelist:        '',
    auditLog:           true,
    apiRateLimit:       100,
  };

  // Đổi password
  currentPassword  = '';
  newPassword      = '';
  confirmPassword  = '';
  showCurrentPwd   = false;
  showNewPwd       = false;
  showConfirmPwd   = false;

  // ── SAVE STATE ─────────────────────────────────
  saving = false;
  savedTab = '';

  onImageChange(event: Event, type: 'logo' | 'favicon'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'logo')    this.logoPreview    = reader.result as string;
      if (type === 'favicon') this.faviconPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    this.saving = true;
    setTimeout(() => {
      this.saving  = false;
      this.savedTab = this.activeTab;
      setTimeout(() => this.savedTab = '', 2000);
    }, 800);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}
