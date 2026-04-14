import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapQualityComponent } from './cheap-quality.component';

describe('CheapQualityComponent', () => {
  let component: CheapQualityComponent;
  let fixture: ComponentFixture<CheapQualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheapQualityComponent]
    });
    fixture = TestBed.createComponent(CheapQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
