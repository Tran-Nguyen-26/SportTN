import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  // Lấy stream dữ liệu từ AuthService
  user$ = this.authService.currentUser$.pipe(map(auth => auth?.userResponse || null));

  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  isLoading = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      // Thay đổi field cho khớp với userResponse (username thay vì firstName/lastName)
      username: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone: [{value: '', disabled: true}, [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      totalPoints: [{value: 0, disabled: true}] // Chỉ để hiển thị
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  loadUserProfile(): void {
    // Lấy giá trị hiện tại từ AuthService (không cần mock)
    const user = this.authService.currentUserValue;
    if (user) {
      this.profileForm.patchValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
        totalPoints: user.totalPoints
      });
    }
  }

  editProfile(): void {
    this.isEditing = true;
    // Chỉ cho phép sửa một số trường nhất định, thường username và email sẽ bị khóa
    this.profileForm.get('phone')?.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.disable();
    this.loadUserProfile();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Tạm thời mô phỏng:
      setTimeout(() => {
        this.successMessage = 'Cập nhật thông tin thành công!';
        this.isLoading = false;
        this.isEditing = false;
        this.profileForm.disable();
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const { oldPassword, newPassword } = this.passwordForm.value;

      // Gọi UserService.changePassword({oldPassword, newPassword})
      console.log('Đang đổi mật khẩu...', { oldPassword, newPassword });

      setTimeout(() => {
        this.successMessage = 'Đổi mật khẩu thành công!';
        this.passwordForm.reset();
        // Reset trạng thái validation sau khi reset form
        Object.keys(this.passwordForm.controls).forEach(key => {
          this.passwordForm.get(key)?.setErrors(null);
        });
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 1500);
    }
  }
}
