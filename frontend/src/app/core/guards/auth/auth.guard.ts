import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = localStorage.getItem('auth_data');

  if (user) {
    return true;
  }

  router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
  return false;
};
