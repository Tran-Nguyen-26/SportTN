import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleSectionComponent } from './flash-sale-section.component';

describe('FlashSaleSectionComponent', () => {
  let component: FlashSaleSectionComponent;
  let fixture: ComponentFixture<FlashSaleSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlashSaleSectionComponent]
    });
    fixture = TestBed.createComponent(FlashSaleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
