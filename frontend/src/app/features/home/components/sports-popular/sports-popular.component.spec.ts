import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsPopularComponent } from './sports-popular.component';

describe('SportsPopularComponent', () => {
  let component: SportsPopularComponent;
  let fixture: ComponentFixture<SportsPopularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportsPopularComponent]
    });
    fixture = TestBed.createComponent(SportsPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
