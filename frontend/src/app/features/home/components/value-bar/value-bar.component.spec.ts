import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueBarComponent } from './value-bar.component';

describe('ValueBarComponent', () => {
  let component: ValueBarComponent;
  let fixture: ComponentFixture<ValueBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueBarComponent]
    });
    fixture = TestBed.createComponent(ValueBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
