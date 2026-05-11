import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  const allowedRoles: string[] = route.data['roles'] ?? [];

  return authService.currentUser$.pipe(
    map(auth => {
      const role = auth?.userResponse?.role;

      if (!role) {
        return router.createUrlTree(['/auth/login']);
      }

      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        return true;
      }

      return router.createUrlTree(['/admin/dashboard']);
    })
  );
};
