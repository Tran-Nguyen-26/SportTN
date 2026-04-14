import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponInputComponent } from './coupon-input.component';

describe('CouponInputComponent', () => {
  let component: CouponInputComponent;
  let fixture: ComponentFixture<CouponInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponInputComponent]
    });
    fixture = TestBed.createComponent(CouponInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
