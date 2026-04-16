import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  successMessage = '';
  currentStep = 1; // Step 1: Email, Step 2: Details, Step 3: Confirmation

  constructor(private fb: FormBuilder, private router: Router) {
    this.initForm();
  }

  ngOnInit(): void { }

  initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)]],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const emailControl = this.registerForm.get('email');
      if (emailControl?.valid) {
        this.currentStep = 2;
      }
    } else if (this.currentStep === 2) {
      const detailsValid = this.registerForm.get('firstName')?.valid &&
        this.registerForm.get('lastName')?.valid &&
        this.registerForm.get('password')?.valid &&
        this.registerForm.get('confirmPassword')?.valid &&
        this.registerForm.get('phoneNumber')?.valid;

      if (detailsValid && !this.registerForm.hasError('passwordMismatch')) {
        this.currentStep = 3;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  register(): void {
    if (this.registerForm.valid && this.registerForm.get('agreeTerms')?.value) {
      this.isLoading = true;
      this.errorMessage = '';

      // Mock registration - Replace with AuthService.register()
      setTimeout(() => {
        // Simulate successful registration
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
        this.isLoading = false;
      }, 1500);
    } else if (!this.registerForm.get('agreeTerms')?.value) {
      this.errorMessage = 'Please agree to terms and conditions';
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getPasswordStrengthMessage(): string {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar].filter(Boolean).length;

    if (strength < 2) return 'Weak';
    if (strength < 3) return 'Fair';
    if (strength < 4) return 'Good';
    return 'Strong';
  }

  getPasswordStrengthColor(): string {
    const message = this.getPasswordStrengthMessage();
    switch (message) {
      case 'Weak': return '#ff5252';
      case 'Fair': return '#ffc107';
      case 'Good': return '#8bc34a';
      case 'Strong': return '#4caf50';
      default: return '#ccc';
    }
  }
}
