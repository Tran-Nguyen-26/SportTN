import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthResponse, LoginRequest, RegisterRequest, UserResponse} from "../../models/auth/auth.model";
import {BehaviorSubject, delay, map, Observable, tap} from "rxjs";
import { environment } from "../../../../enviroments/enviroment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isLoggedIn$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('auth_data');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auth_data');
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const authData = response.data;
          localStorage.setItem('auth_data', JSON.stringify(authData));
          this.currentUserSubject.next(authData);
        }
      }));
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/sign-up`, registerRequest);
  }

  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/check-email`, { params: { email }});
  }

  getAccessToken(): string | null {
    return this.currentUserSubject.value?.accessToken || null;
  }

  public get currentUserValue(): UserResponse | null {
    return this.currentUserSubject.value?.userResponse || null;
  }

  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  logout(): void {
    const authData = this.currentUserSubject.value;
    const refreshToken = authData?.refreshToken;

    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, {refreshToken})
        .subscribe({
          next: () => {
            console.log('Backend đã hủy session');
            this.cleanUpAndNavigate();
          },
          error: (err) => {
            console.error('Lỗi khi gọi API logout', err);
            this.cleanUpAndNavigate();
          }
        })
    }
  }

  private cleanUpAndNavigate(): void {
    localStorage.removeItem('auth_data');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }
}

