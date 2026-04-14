import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormLayoutComponent } from './auth-form-layout.component';

describe('AuthFormLayoutComponent', () => {
  let component: AuthFormLayoutComponent;
  let fixture: ComponentFixture<AuthFormLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthFormLayoutComponent]
    });
    fixture = TestBed.createComponent(AuthFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
