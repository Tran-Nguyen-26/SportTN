import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {AuthService} from "../../../../core/services/auth/auth.service";
import {RegisterRequest} from "../../../../core/models/auth/auth.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  currentStep = 1;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Step 1
      email: ['', [Validators.required, Validators.email]],
      // Step 2
      username: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Validator kiểm tra mật khẩu khớp nhau
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  nextStep() {
    const emailControl = this.registerForm.get('email');

    if (emailControl?.valid) {
      this.isLoading = true;

      this.authService.checkEmailExists(emailControl.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.data === true) {
            emailControl.setErrors({ 'alreadyExists': true });
          } else {
            this.currentStep = 2;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi kết nối server.';
        }
      });
    }
  }

  previousStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  register(): void {

    this.registerForm.markAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValues = this.registerForm.value;

      const requestData: RegisterRequest = {
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phoneNumber,
      }

      this.authService.register(requestData).subscribe({
        next: (res) => {
          this.isLoading = false;
          const event = new CustomEvent('show-toast', {
            detail: { message: 'Đăng ký thành công!' }
          });
          window.dispatchEvent(event);
          this.router.navigate(['/auth/login']);

        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Đăng ký thất bại, vui lòng thử lại';
        }
      })
    }
  }
}
