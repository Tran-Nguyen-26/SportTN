import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AuthService} from "../../services/auth/auth.service";

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'WAREHOUSE'];

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return authService.currentUser$.pipe(
    map(authRes => {
      // Chưa đăng nhập → về login
      if (!authRes) {
        return router.createUrlTree(['/auth/login']);
      }

      const role = authRes.userResponse.role;

      if (!ADMIN_ROLES.includes(role)) {
        return router.createUrlTree(['/home']);
      }

      // Hợp lệ → cho vào
      return true;
    })
  );
};
