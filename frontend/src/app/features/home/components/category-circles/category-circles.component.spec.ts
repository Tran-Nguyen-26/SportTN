import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCirclesComponent } from './category-circles.component';

describe('CategoryCirclesComponent', () => {
  let component: CategoryCirclesComponent;
  let fixture: ComponentFixture<CategoryCirclesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryCirclesComponent]
    });
    fixture = TestBed.createComponent(CategoryCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
