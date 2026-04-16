import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';
  rememberMe = false;

  constructor(private router: Router, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail });
      this.rememberMe = true;
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Mock login - Replace with AuthService.login()
      setTimeout(() => {
        // Store remember me preference
        if (this.loginForm.get('rememberMe')?.value) {
          localStorage.setItem('rememberEmail', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        // Store auth token (mock)
        localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());

        // Navigate to home
        this.router.navigate(['/home']);
        this.isLoading = false;
      }, 1000);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword(): void {
    // Implement forgot password flow
    this.router.navigate(['/auth/forgot-password']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
