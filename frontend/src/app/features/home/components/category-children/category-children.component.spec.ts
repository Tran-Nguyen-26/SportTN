import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryChildrenComponent } from './category-children.component';

describe('CategoryChildrenComponent', () => {
  let component: CategoryChildrenComponent;
  let fixture: ComponentFixture<CategoryChildrenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryChildrenComponent]
    });
    fixture = TestBed.createComponent(CategoryChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
