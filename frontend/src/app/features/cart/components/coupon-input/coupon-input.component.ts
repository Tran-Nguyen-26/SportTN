import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-coupon-input',
  templateUrl: './coupon-input.component.html',
  styleUrls: ['./coupon-input.component.css']
})
export class CouponInputComponent {
  couponForm: FormGroup;
  @Output() couponApplied = new EventEmitter<string>();
  appliedCoupon: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      couponCode: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  applyCoupon(): void {
    if (this.couponForm.valid) {
      const couponCode = this.couponForm.get('couponCode')?.value;
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Mock coupon validation - Replace with CouponService.validateCoupon()
      setTimeout(() => {
        // Simulate valid coupons
        const validCoupons = ['SAVE10', 'SAVE20', 'FREESHIP', 'WELCOME50'];
        if (validCoupons.includes(couponCode.toUpperCase())) {
          this.appliedCoupon = couponCode;
          this.successMessage = `Coupon "${couponCode}" applied successfully!`;
          this.couponApplied.emit(couponCode);
          this.couponForm.reset();
        } else {
          this.errorMessage = 'Invalid coupon code. Please try again.';
        }
        this.isLoading = false;
      }, 500);
    }
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.successMessage = '';
    this.couponForm.reset();
  }
}
