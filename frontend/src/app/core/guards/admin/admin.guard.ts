import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AuthService} from "../../services/auth/auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return authService.currentUser$.pipe(
    map(authRes => {

      if (!authRes) {
        return router.createUrlTree(['/auth/login']);
      }

      if (authRes.userResponse.role === 'CUSTOMER') {
        return router.createUrlTree(['/']);
      }

      // Là ADMIN → cho vào
      return true;
    })
  );
};
