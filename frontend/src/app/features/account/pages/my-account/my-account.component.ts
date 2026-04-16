import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UpdateUserRequest } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user: User | null = null;
  isLoading = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  loadUserProfile(): void {
    // Mock data - Replace with UserService.getProfile()
    this.user = {
      id: '1',
      email: 'user@example.com',
      firstName: 'Nguyễn',
      lastName: 'Trần',
      phoneNumber: '+84905123456'
    };

    this.profileForm.patchValue(this.user);
    this.profileForm.disable();
  }

  editProfile(): void {
    this.isEditing = true;
    this.profileForm.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.disable();
    this.loadUserProfile();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Mock save - Replace with UserService.updateProfile()
      setTimeout(() => {
        this.user = this.profileForm.value;
        this.successMessage = 'Profile updated successfully!';
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
      // Mock change - Replace with UserService.changePassword()
      setTimeout(() => {
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }
}
