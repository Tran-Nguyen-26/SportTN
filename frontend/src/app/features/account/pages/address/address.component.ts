import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address, AddressRequest } from 'src/app/core/models/address/address.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addresses: Address[] = [];
  addressForm!: FormGroup;
  isLoading = false;
  showForm = false;
  editingId: string | null = null;
  successMessage = '';

  countries = ['India', 'USA', 'Canada', 'UK', 'Australia'];
  states: { [key: string]: string[] } = {
    'India': ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
    'USA': ['California', 'Texas', 'Florida', 'New York'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia'],
    'UK': ['England', 'Scotland', 'Wales'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland']
  };

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      country: ['India', Validators.required],
      isDefault: [false]
    });
  }

  loadAddresses(): void {
    this.isLoading = true;
    // Mock data - Replace with AddressService.getAddresses()
    setTimeout(() => {
      this.addresses = [
        {
          id: '1',
          name: 'Home',
          phoneNumber: '+84905123456',
          address: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true
        },
        {
          id: '2',
          name: 'Office',
          phoneNumber: '+84905123457',
          address: '456 Business Park',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560002',
          country: 'India',
          isDefault: false
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.addressForm.reset({ country: 'India' });
  }

  editAddress(address: Address): void {
    this.showForm = true;
    this.editingId = address.id || null;
    this.addressForm.patchValue(address);
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      this.isLoading = true;
      // Mock save - Replace with AddressService.saveAddress()
      setTimeout(() => {
        if (this.editingId) {
          const index = this.addresses.findIndex(a => a.id === this.editingId);
          if (index > -1) {
            this.addresses[index] = { ...this.addresses[index], ...this.addressForm.value };
          }
        } else {
          const newAddress: Address = { id: Date.now().toString(), ...this.addressForm.value };
          this.addresses.push(newAddress);
        }
        this.successMessage = this.editingId ? 'Address updated successfully!' : 'Address added successfully!';
        this.showForm = false;
        this.addressForm.reset({ country: 'India' });
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 500);
    }
  }

  deleteAddress(id: string | undefined): void {
    if (id) {
      this.addresses = this.addresses.filter(a => a.id !== id);
      this.successMessage = 'Address deleted successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  setDefaultAddress(id: string | undefined): void {
    if (id) {
      this.addresses.forEach(a => a.isDefault = a.id === id);
      this.successMessage = 'Default address updated!';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.addressForm.reset({ country: 'India' });
  }

  getStateOptions(): string[] {
    const country = this.addressForm.get('country')?.value || 'India';
    return this.states[country] || [];
  }
}
