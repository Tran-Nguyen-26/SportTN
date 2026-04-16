import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  balance: number = 0;
  transactions: Transaction[] = [];
  rechargeForm!: FormGroup;
  showRechargeForm = false;
  isProcessing = false;
  successMessage = '';
  errorMessage = '';

  rechargeAmounts = [100, 250, 500, 1000, 2500, 5000];
  paymentMethods = ['Add Money', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking'];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadWalletData();
  }

  initForm(): void {
    this.rechargeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(100)]],
      paymentMethod: ['', Validators.required],
      customAmount: ['']
    });
  }

  loadWalletData(): void {
    // Mock data - Replace with WalletService.getWalletData()
    this.balance = 1500;
    this.transactions = [
      {
        id: '1',
        type: 'debit',
        amount: 250,
        description: 'Purchase - Nike Sports Shoes',
        date: '2024-01-20',
        status: 'completed'
      },
      {
        id: '2',
        type: 'credit',
        amount: 500,
        description: 'Referred Friend Bonus',
        date: '2024-01-18',
        status: 'completed'
      },
      {
        id: '3',
        type: 'debit',
        amount: 120,
        description: 'Purchase - Adidas Shirt',
        date: '2024-01-15',
        status: 'completed'
      },
      {
        id: '4',
        type: 'credit',
        amount: 1000,
        description: 'Wallet Recharge',
        date: '2024-01-10',
        status: 'completed'
      },
      {
        id: '5',
        type: 'credit',
        amount: 200,
        description: 'Birthday Cash',
        date: '2024-01-05',
        status: 'completed'
      }
    ];
  }

  quickRecharge(amount: number): void {
    this.rechargeForm.patchValue({ amount });
    this.showRechargeForm = true;
    this.rechargeForm.get('customAmount')?.reset();
  }

  rechargeWallet(): void {
    if (this.rechargeForm.valid) {
      const amount = this.rechargeForm.get('amount')?.value ||
        this.rechargeForm.get('customAmount')?.value;

      if (!amount || amount < 100) {
        this.errorMessage = 'Minimum recharge amount is ₹100';
        return;
      }

      this.isProcessing = true;
      this.errorMessage = '';

      // Mock payment processing - Replace with WalletService.rechargeWallet()
      setTimeout(() => {
        this.balance += amount;
        this.transactions.unshift({
          id: Date.now().toString(),
          type: 'credit',
          amount: amount,
          description: 'Wallet Recharge',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        });

        this.successMessage = `₹${amount} added successfully to your wallet!`;
        this.showRechargeForm = false;
        this.rechargeForm.reset();
        this.isProcessing = false;

        setTimeout(() => this.successMessage = '', 3000);
      }, 1500);
    }
  }

  cancelRecharge(): void {
    this.showRechargeForm = false;
    this.rechargeForm.reset();
    this.errorMessage = '';
  }

  selectQuickAmount(amount: number): void {
    this.rechargeForm.patchValue({ amount });
  }

  setCustomAmount(): void {
    this.rechargeForm.patchValue({ amount: null });
  }

  getTransactionIcon(type: string): string {
    return type === 'credit' ? 'add_circle' : 'remove_circle';
  }

  getTransactionColor(type: string): string {
    return type === 'credit' ? 'accent' : 'warn';
  }
}
