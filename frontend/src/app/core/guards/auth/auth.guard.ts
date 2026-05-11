import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from "../../services/auth/auth.service";

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'WAREHOUSE'];

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return authService.currentUser$.pipe(
    map(authRes => {
      if (!authRes) return true;

      const role = authRes.userResponse.role;

      // Là admin role → redirect về admin
      if (ADMIN_ROLES.includes(role)) {
        return router.createUrlTree(['/admin']);
      }

      return true; // CUSTOMER → cho vào bình thường
    })
  );
};
