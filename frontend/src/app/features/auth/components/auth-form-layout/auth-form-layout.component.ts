import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-layout',
  templateUrl: './auth-form-layout.component.html',
  styleUrls: ['./auth-form-layout.component.css'] 
})
export class AuthFormLayoutComponent {
  @Input() title: string = '';
}