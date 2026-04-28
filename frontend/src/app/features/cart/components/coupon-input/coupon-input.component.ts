import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

export interface CouponResult {
  code: string;
  discountPercent: number;
}

// Mock coupon catalog — replace with CouponService.validate()
const COUPON_CATALOG: Record<string, number> = {
  SAVE10:    0.10,
  SAVE20:    0.20,
  FREESHIP:  0,
  WELCOME50: 0.50,
  STN2026:   0.15,
};

@Component({
  selector: 'app-coupon-input',
  templateUrl: './coupon-input.component.html',
  styleUrls: ['./coupon-input.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CouponInputComponent {
  @Output() couponApplied = new EventEmitter<CouponResult>();
  @Output() couponRemoved = new EventEmitter<void>();

  couponForm: FormGroup;
  appliedCoupon: string | null = null;
  appliedDiscount = 0;
  isLoading = false;
  errorMessage = '';

  hintCodes = ['SAVE10', 'SAVE20', 'WELCOME50'];

  constructor(private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      couponCode: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  applyCoupon(): void {
    if (this.couponForm.invalid || this.isLoading) return;

    const raw: string = this.couponForm.get('couponCode')?.value ?? '';
    const code = raw.trim().toUpperCase();

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate async API call — replace with: this.couponService.validate(code)
    setTimeout(() => {
      const discount = COUPON_CATALOG[code];

      if (discount !== undefined) {
        this.appliedCoupon = code;
        this.appliedDiscount = discount;
        this.couponApplied.emit({ code, discountPercent: discount });
        this.couponForm.reset();
      } else {
        this.errorMessage = 'Mã không hợp lệ hoặc đã hết hạn.';
      }

      this.isLoading = false;
    }, 500);
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.appliedDiscount = 0;
    this.couponForm.reset();
    this.errorMessage = '';
    this.couponRemoved.emit();
  }

  fillCoupon(code: string): void {
    this.couponForm.patchValue({ couponCode: code });
    this.errorMessage = '';
  }

  clearError(): void {
    this.errorMessage = '';
  }

  getDiscountLabel(): string {
    if (this.appliedDiscount === 0) return 'Miễn phí vận chuyển';
    return `Giảm ${this.appliedDiscount * 100}% tổng đơn hàng`;
  }
}
