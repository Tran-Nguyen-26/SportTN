import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartDrawerComponent } from './add-to-cart-drawer.component';

describe('AddToCartDrawerComponent', () => {
  let component: AddToCartDrawerComponent;
  let fixture: ComponentFixture<AddToCartDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToCartDrawerComponent]
    });
    fixture = TestBed.createComponent(AddToCartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
