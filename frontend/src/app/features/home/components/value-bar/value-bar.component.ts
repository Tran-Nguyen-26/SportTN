import { Component } from '@angular/core';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-value-bar',
  templateUrl: './value-bar.component.html',
  styleUrls: ['./value-bar.component.css']
})
export class ValueBarComponent {
  valueItems: ValueItem[] = [
    {
      icon: 'local_shipping',
      title: 'Free Shipping',
      description: 'Free shipping from ₹449'
    },
    {
      icon: 'store',
      title: 'Physical Store',
      description: 'Visit our stores'
    },
    {
      icon: 'shopping_basket',
      title: 'Click & Collect',
      description: 'Order online, pick up in store'
    },
    {
      icon: 'card_giftcard',
      title: 'Earn Points',
      description: 'Earn rewards on every purchase'
    },
    {
      icon: 'swap_horizontal_circle',
      title: '365 Day Return',
      description: 'Easy returns upto 365 days'
    },
    {
      icon: 'security',
      title: '2 Year Warranty',
      description: 'Extended warranty on products'
    }
  ];
}
