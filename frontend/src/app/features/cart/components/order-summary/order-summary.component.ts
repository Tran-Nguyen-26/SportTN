import {
  Component, Input, Output, EventEmitter,
  computed, signal, OnInit
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartResponse } from "../../../../core/services/cart/cart.service";
import { AddressService } from "../../../../core/services/user/address.service";
import { OrderService, CreateOrderRequest, PaymentMethod } from "../../../../core/services/order/order.service";
import {Router} from "@angular/router";

const FREE_SHIP_THRESHOLD = 500_000;
const SHIPPING_FEE        = 30_000;
const TAX_RATE            = 0.10;

export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  fullAddress?: string;
}

// Trạng thái sau khi đặt hàng
export type OrderState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  animations: [
    trigger('rowFade', [
      transition(':enter', [
        style({ opacity: 0, height: 0, marginBottom: 0 }),
        animate('180ms ease-out', style({ opacity: 1, height: '*', marginBottom: '*' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, height: 0, marginBottom: 0 }))
      ])
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ]),
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px) scale(0.96)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(8px) scale(0.96)' }))
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('160ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class OrderSummaryComponent implements OnInit {

  // ── Signals ────────────────────────────────────────────────────────────────
  cartSignal            = signal<CartResponse | null>(null);
  discountPercentSignal = signal<number>(0);

  // ── Address state ──────────────────────────────────────────────────────────
  userAddresses: Address[]     = [];
  selectedAddress: Address | null = null;
  showAddressPicker = false;
  addressLoading    = false;

  // ── Payment method (nhận từ cart-page) ────────────────────────────────────
  @Input() selectedPaymentMethod: PaymentMethod = 'COD';

  // ── Voucher (nhận từ cart-page qua coupon-input) ───────────────────────────
  @Input() voucherId: number | null = null;

  // ── Order state ────────────────────────────────────────────────────────────
  orderState: OrderState = 'idle';
  showPaymentModal = false;

  // ── Inputs ─────────────────────────────────────────────────────────────────
  @Input() set cart(value: CartResponse) {
    this.cartSignal.set(value);
  }

  @Input() set discountPercent(value: number) {
    this.discountPercentSignal.set(value);
  }

  // ── Outputs ────────────────────────────────────────────────────────────────
  @Output() checkout        = new EventEmitter<{ addressId: number }>();
  @Output() addressSelected = new EventEmitter<Address>();
  @Output() orderPlaced     = new EventEmitter<void>(); // emit để cart-page clear cart

  constructor(
    private router: Router,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadUserAddresses();
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  subtotal = computed(() => this.cartSignal()?.total || 0);

  discountAmount = computed(() =>
    Math.round(this.subtotal() * (this.discountPercentSignal() / 100))
  );

  tax = computed(() => {
    const afterDiscount = this.subtotal() - this.discountAmount();
    return Math.round(afterDiscount * TAX_RATE);
  });

  shipping = computed(() => {
    const s = this.subtotal();
    if (s === 0) return 0;
    return s >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  });

  total = computed(() =>
    (this.subtotal() - this.discountAmount()) + this.tax() + this.shipping()
  );

  freeShipGap = computed(() =>
    Math.max(0, FREE_SHIP_THRESHOLD - this.subtotal())
  );

  freeShipProgress = computed(() =>
    Math.min(100, Math.round((this.subtotal() / FREE_SHIP_THRESHOLD) * 100))
  );

  get isCOD(): boolean {
    return this.selectedPaymentMethod === 'COD';
  }

  get canCheckout(): boolean {
    return (this.cartSignal()?.cartItems?.length ?? 0) > 0
      && !!this.selectedAddress
      && this.orderState !== 'submitting';
  }

  // ── Address methods ────────────────────────────────────────────────────────
  loadUserAddresses(): void {
    this.addressLoading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (res) => {
        if (res.data) {
          this.userAddresses = res.data.map((a: Address) => ({
            ...a,
            fullAddress: this.buildFullAddress(a),
          }));
          this.selectedAddress =
            this.userAddresses.find(a => a.isDefault) ?? this.userAddresses[0] ?? null;
        }
        this.addressLoading = false;
      },
      error: () => { this.addressLoading = false; }
    });
  }

  openAddressPicker(): void  { this.showAddressPicker = true; }
  closeAddressPicker(): void {
    this.router.navigate(['/account/address']);
    this.showAddressPicker = false;
  }

  selectAddress(address: Address): void {
    this.selectedAddress = address;
    this.showAddressPicker = false;
    this.addressSelected.emit(address);
  }

  buildFullAddress(a: Address): string {
    return [a.addressDetail, a.ward, a.district, a.province]
      .filter(Boolean).join(', ');
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  proceedCheckout(): void {
    if (!this.selectedAddress) {
      this.showAddressPicker = true;
      return;
    }

    if (!this.isCOD) {
      // Mở modal nhập thông tin thanh toán cho các method khác
      this.showPaymentModal = true;
      return;
    }

    // COD: đặt hàng luôn
    this.placeOrder();
  }

  /** Được gọi từ modal khi xác nhận payment info (non-COD) */
  onPaymentModalConfirm(): void {
    this.showPaymentModal = false;
    this.placeOrder();
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  placeOrder(): void {
    const cart = this.cartSignal();
    const addressId = this.selectedAddress?.id;

    if (!cart?.cartItems?.length || !addressId) return;

    const request: CreateOrderRequest = {
      addressId,
      paymentMethod: this.selectedPaymentMethod,
      items: cart.cartItems.map(item => ({
        variantId: item.variant?.id,
        quantity: item.quantity
      })),
      voucherId: this.voucherId ?? null
    };

    this.orderState = 'submitting';

    this.orderService.createOrder(request).subscribe({
      next: () => {
        // BE trả 202 — RabbitMQ xử lý async
        this.orderState = 'success';
        setTimeout(() => {
          this.orderPlaced.emit();
          this.router.navigate(['/account/order-history']);
        }, 2000);
      },
      error: (err) => {
        console.error('[ORDER] Lỗi đặt hàng:', err);
        this.orderState = 'error';

        setTimeout(() => {
          if (this.orderState === 'error') this.orderState = 'idle';
        }, 5000);
      }
    });
  }

  dismissToast(): void {
    this.orderState = 'idle';
  }

  get paymentMethodLabel(): string {
    const map: Record<PaymentMethod, string> = {
      COD: 'Thanh toán khi nhận hàng (COD)',
      CREDIT_CARD: 'Thẻ tín dụng / Ghi nợ',
      E_WALLET: 'Ví điện tử',
      BANK_TRANSFER: 'Chuyển khoản ngân hàng'
    };
    return map[this.selectedPaymentMethod] ?? '';
  }
}
