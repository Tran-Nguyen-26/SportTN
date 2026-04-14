import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { CartPageComponent } from './features/cart/pages/cart-page/cart-page.component';
import { AccountModule } from './features/account/account.module';

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { path: 'home', component: HomePageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'account',
    loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
