import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBannerComponent } from './category-banner.component';

describe('CategoryBannerComponent', () => {
  let component: CategoryBannerComponent;
  let fixture: ComponentFixture<CategoryBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryBannerComponent]
    });
    fixture = TestBed.createComponent(CategoryBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
