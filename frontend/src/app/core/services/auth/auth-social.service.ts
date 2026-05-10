import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser
} from '@abacritt/angularx-social-login';
import { Observable } from 'rxjs';
import {environment} from "../../../../environments/enviroment";

@Injectable({ providedIn: 'root' })
export class AuthSocialService {

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {}

  loginWithGoogle(): void {
    (window as any).google.accounts.id.prompt();
  }

  loginWithFacebook(): Promise<SocialUser> {
    return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  sendSocialToken(provider: 'google' | 'facebook', token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/social-login`, {
      provider,
      token
    });
  }
}
