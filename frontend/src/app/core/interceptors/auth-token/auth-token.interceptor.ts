import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  private router = inject(Router);

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authData = localStorage.getItem('auth_data');

    if (authData) {
      const parsedData = JSON.parse(authData);
      const token = parsedData.accessToken;

      if (token) {
        const cloned = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(cloned);
      }
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('auth_data');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    )
  }
}
