import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryDrawerComponent } from './add-category-drawer.component';

describe('AddCategoryDrawerComponent', () => {
  let component: AddCategoryDrawerComponent;
  let fixture: ComponentFixture<AddCategoryDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCategoryDrawerComponent]
    });
    fixture = TestBed.createComponent(AddCategoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
