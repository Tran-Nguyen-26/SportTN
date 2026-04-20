import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../../core/services/auth/auth.service";

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
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
      this.loginForm.disable();
      this.errorMessage = '';

      const credenitals = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credenitals).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (this.loginForm.get('rememberMe')?.value) {
            localStorage.setItem('rememberEmail', this.loginForm.value.email);
          } else {
            localStorage.removeItem('remerberEmail');
          }

          const role = response.data?.userResponse.role;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          // this.router.navigateByUrl(returnUrl);
          if (returnUrl) {
            this.router.navigate(returnUrl);
          } else if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
        }
      });
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
