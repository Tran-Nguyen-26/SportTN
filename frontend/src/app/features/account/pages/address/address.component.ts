// src/app/features/pages/address/address.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Address, AddressRequest, AddressService} from "../../../../core/services/user/address.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  addresses: Address[]   = [];
  addressForm!: FormGroup;
  isLoading    = false;
  isSaving     = false;
  showForm     = false;
  editingId: number | null = null;
  deleteConfirmId: number | null = null;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  // Dữ liệu tỉnh/thành — có thể thay bằng API GHN/GHTKs
  provinces = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  initForm(): void {
    this.addressForm = this.fb.group({
      receiverName:  ['', [Validators.required, Validators.minLength(2)]],
      receiverPhone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[3-9]\d{8}$/)]],
      province:      ['', Validators.required],
      district:      ['', Validators.required],
      ward:          ['', Validators.required],
      addressDetail: ['', [Validators.required, Validators.minLength(5)]],
      isDefault:     [false],
    });
  }

  // ── Load ────────────────────────────────────────────────────────────────────

  loadAddresses(): void {
    this.isLoading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data ?? [];
        this.isLoading = false;
        console.log("Danh sách địa chỉ: ", res.data);
      },
      error: () => {
        this.showToast('Không thể tải danh sách địa chỉ', 'error');
        this.isLoading = false;
      }
    });
  }

  // ── Show / hide form ────────────────────────────────────────────────────────

  showAddForm(): void {
    this.showForm  = true;
    this.editingId = null;
    this.addressForm.reset({ isDefault: false });
    setTimeout(() => document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  editAddress(address: Address): void {
    this.showForm  = true;
    this.editingId = address.id;
    this.addressForm.patchValue({
      receiverName:  address.receiverName,
      receiverPhone: address.receiverPhone,
      province:      address.province,
      district:      address.district,
      ward:          address.ward,
      addressDetail: address.addressDetail,
      isDefault:     address.isDefault,
    });
    setTimeout(() => document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  cancelForm(): void {
    this.showForm  = false;
    this.editingId = null;
    this.addressForm.reset({ isDefault: false });
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const req: AddressRequest = this.addressForm.value;

    const call = this.editingId
      ? this.addressService.updateAddress(this.editingId, req)
      : this.addressService.createAddress(req);

    call.subscribe({
      next: () => {
        this.showToast(
          this.editingId ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!',
          'success'
        );
        this.cancelForm();
        this.loadAddresses();
        this.isSaving = false;
      },
      error: () => {
        this.showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
        this.isSaving = false;
      }
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  confirmDelete(id: number): void { this.deleteConfirmId = id; }
  cancelDelete():            void { this.deleteConfirmId = null; }

  deleteAddress(id: number): void {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a.id !== id);
        this.deleteConfirmId = null;
        this.showToast('Đã xóa địa chỉ', 'success');
      },
      error: () => this.showToast('Không thể xóa địa chỉ', 'error')
    });
  }

  // ── Set default ─────────────────────────────────────────────────────────────

  setDefaultAddress(id: number): void {
    this.addressService.setDefault(id).subscribe({
      next: () => {
        this.addresses.forEach(a => a.isDefault = a.id === id);
        this.showToast('Đã đặt làm địa chỉ mặc định', 'success');
      },
      error: () => this.showToast('Không thể cập nhật', 'error')
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  getFullAddress(a: Address): string {
    return [a.addressDetail, a.ward, a.district, a.province].filter(Boolean).join(', ');
  }

  fieldError(field: string): boolean {
    const ctrl = this.addressForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
