import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavActionsComponent } from './nav-actions.component';

describe('NavActionsComponent', () => {
  let component: NavActionsComponent;
  let fixture: ComponentFixture<NavActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavActionsComponent]
    });
    fixture = TestBed.createComponent(NavActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
