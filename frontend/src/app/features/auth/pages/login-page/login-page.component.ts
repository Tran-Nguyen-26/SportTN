import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';
  rememberMe = false;

  // ── Forgot password ──────────────────────────────
  showForgotModal = false;
  forgotStep = 1; // 1: email, 2: otp, 3: new password, 4: success
  forgotLoading = false;
  forgotError = '';

  forgotEmailControl = new FormControl('', [Validators.required, Validators.email]);
  otpControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  newPasswordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPasswordControl = new FormControl('', [Validators.required]);

  hideNewPassword = true;
  hideConfirmPassword = true;

  resendCountdown = 0;
  private countdownInterval: any;

  get passwordMismatch(): boolean {
    return this.newPasswordControl.value !== this.confirmPasswordControl.value
      && this.confirmPasswordControl.touched;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
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
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.loginForm.enable();
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: 'Đăng nhập thành công!' }
          }));
          if (this.loginForm.get('rememberMe')?.value) {
            localStorage.setItem('rememberEmail', this.loginForm.value.email);
          } else {
            localStorage.removeItem('rememberEmail');
          }
          const role = response.data?.userResponse.role;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigate([returnUrl]);
          } else if (role !== 'CUSTOMER') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.loginForm.enable();
          this.errorMessage = err.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // ── Modal control ────────────────────────────────

  forgotPassword(): void {
    this.showForgotModal = true;
    this.forgotStep = 1;
    this.forgotError = '';
    this.forgotEmailControl.reset();
    this.otpControl.reset();
    this.newPasswordControl.reset();
    this.confirmPasswordControl.reset();
    this.resendCountdown = 0;
    clearInterval(this.countdownInterval);
  }

  closeForgotModal(): void {
    this.showForgotModal = false;
    this.forgotStep = 1;
    this.forgotError = '';
    clearInterval(this.countdownInterval);
    this.resendCountdown = 0;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeForgotModal();
    }
  }

  // ── Step 1: Gửi OTP ─────────────────────────────

  sendOtp(): void {
    if (this.forgotEmailControl.invalid) {
      this.forgotEmailControl.markAsTouched();
      return;
    }
    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.sendOtp(this.forgotEmailControl.value!).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 2;
        this.startCountdown();
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'Gửi OTP thất bại. Vui lòng thử lại!';
      }
    });
  }
  // ── Step 2: Verify OTP ───────────────────────────

  verifyOtp(): void {
    if (this.otpControl.invalid) {
      this.otpControl.markAsTouched();
      return;
    }
    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.verifyOtp(
      this.forgotEmailControl.value!,
      this.otpControl.value!
    ).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 3;
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'OTP không đúng hoặc đã hết hạn!';
      }
    });
  }

  // ── Step 3: Đặt lại mật khẩu ────────────────────

  resetPassword(): void {
    if (this.newPasswordControl.invalid) {
      this.newPasswordControl.markAsTouched();
      return;
    }
    if (this.confirmPasswordControl.invalid) {
      this.confirmPasswordControl.markAsTouched();
      return;
    }
    if (this.passwordMismatch) return;

    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.resetPassword(
      this.forgotEmailControl.value!,
      this.otpControl.value!,
      this.newPasswordControl.value!
    ).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotStep = 4;
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại!';
      }
    });
  }

  // ── Countdown gửi lại OTP ────────────────────────

  private startCountdown(): void {
    this.resendCountdown = 60;
    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
}
