import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ]
})
export class MyAccountComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  user$ = this.authService.currentUser$.pipe(
    map(auth => auth?.userResponse || null)
  );

  hideOld     = true;
  hideNew     = true;
  hideConfirm = true;

  isLoading  = false;
  isEditing  = false;

  successMessage = '';
  errorMessage   = '';

  // Hạng thành viên
  private readonly SILVER_MAX  = 500;   // điểm tối đa của hạng Bạc
  private readonly GOLD_MIN    = 500;   // điểm tối thiểu để lên hạng Vàng

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // ─── Form init ──────────────────────────────────────────────────────────────

  initForms(): void {
    this.profileForm = this.fb.group({
      username:    [{ value: '', disabled: true }, Validators.required],
      email:       [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone:       [{ value: '', disabled: true }, [Validators.pattern(/^\+?[\d\s\-()]+$/)]],
      totalPoints: [{ value: 0,  disabled: true }]
    });

    this.passwordForm = this.fb.group(
      {
        oldPassword:     ['', Validators.required],
        newPassword:     ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const pw      = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
  }

  // ─── Load profile ────────────────────────────────────────────────────────────

  loadUserProfile(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.profileForm.patchValue({
        username:    user.username,
        email:       user.email,
        phone:       user.phone ?? '',
        totalPoints: user.totalPoints ?? 0
      });
    }
  }

  // ─── Edit profile ─────────────────────────────────────────────────────────────

  editProfile(): void {
    this.isEditing = true;
    this.profileForm.get('phone')?.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.get('phone')?.disable();
    this.loadUserProfile();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isLoading = true;

    // TODO: replace with this.userService.updateProfile({ phone: ... }).subscribe(...)
    setTimeout(() => {
      this.showSuccess('Cập nhật thông tin thành công!');
      this.isLoading  = false;
      this.isEditing  = false;
      this.profileForm.get('phone')?.disable();
    }, 1000);
  }

  // ─── Change password ──────────────────────────────────────────────────────────

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isLoading = true;

    const { oldPassword, newPassword } = this.passwordForm.value;
    // TODO: replace with this.authService.changePassword({ oldPassword, newPassword }).subscribe(...)
    console.log('[MyAccount] changePassword', { oldPassword, newPassword });

    setTimeout(() => {
      this.showSuccess('Đổi mật khẩu thành công!');
      this.passwordForm.reset();
      Object.keys(this.passwordForm.controls).forEach(k =>
        this.passwordForm.get(k)?.setErrors(null)
      );
      this.isLoading = false;
    }, 1500);
  }

  // ─── Membership helpers ───────────────────────────────────────────────────────

  getProgressPercent(points: number): number {
    const pct = Math.min((points / this.GOLD_MIN) * 100, 100);
    return Math.round(pct);
  }

  getRemainingPoints(points: number): number {
    return Math.max(this.GOLD_MIN - points, 0);
  }

  // ─── Avatar / display helpers ─────────────────────────────────────────────────

  getInitials(username: string): string {
    if (!username) return 'U';
    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }

  // ─── Password strength ────────────────────────────────────────────────────────

  get pwStrength(): number {
    const pw = this.passwordForm.get('newPassword')?.value ?? '';
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)           score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/\d/.test(pw))            score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;
    return Math.min(score, 3);
  }

  get pwStrengthLabel(): string {
    return ['', 'Yếu', 'Trung bình', 'Mạnh'][this.pwStrength] ?? '';
  }

  // ─── Notification helpers ─────────────────────────────────────────────────────

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage   = '';
    setTimeout(() => this.successMessage = '', 3500);
  }

  showError(msg: string): void {
    this.errorMessage   = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 3500);
  }
}
