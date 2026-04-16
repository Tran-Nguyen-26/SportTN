import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface CategoryCircle {
  id: string;
  label: string;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-category-circles',
  templateUrl: './category-circles.component.html',
  styleUrls: ['./category-circles.component.css']
})
export class CategoryCirclesComponent {
  categories: CategoryCircle[] = [
    {
      id: '1',
      label: 'Sale',
      icon: 'local_offer',
      color: '#ff5252',
      route: '/products?filter=sale'
    },
    {
      id: '2',
      label: 'Discounts',
      icon: 'percent',
      color: '#ffc400',
      route: '/products?filter=discount'
    },
    {
      id: '3',
      label: 'New',
      icon: 'new_releases',
      color: '#4caf50',
      route: '/products?filter=new'
    },
    {
      id: '4',
      label: 'Budget',
      icon: 'attach_money',
      color: '#2196f3',
      route: '/products?filter=budget'
    },
    {
      id: '5',
      label: 'Sunscreen',
      icon: 'wb_sunny',
      color: '#ff9800',
      route: '/products?filter=sunscreen'
    },
    {
      id: '6',
      label: 'Men',
      icon: 'male',
      color: '#1e3a8a',
      route: '/products?filter=men'
    },
    {
      id: '7',
      label: 'Women',
      icon: 'female',
      color: '#ec407a',
      route: '/products?filter=women'
    },
    {
      id: '8',
      label: 'Kids',
      icon: 'child_friendly',
      color: '#00bcd4',
      route: '/products?filter=kids'
    }
  ];

  constructor(private router: Router) { }

  openCategory(category: CategoryCircle): void {
    if (category.route) {
      this.router.navigateByUrl(category.route);
    }
  }
}
