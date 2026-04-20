import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AuthService} from "../../services/auth/auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return authService.currentUser$.pipe(
    map(authRes => {

      // Chưa đăng nhập → về login
      if (!authRes) {
        return router.createUrlTree(['/auth/login']);
      }

      // Không phải ADMIN → về trang chủ
      if (authRes.userResponse.role !== 'ADMIN') {
        return router.createUrlTree(['/']);
      }

      // Là ADMIN → cho vào
      return true;
    })
  );
};
