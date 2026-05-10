import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthSocialService} from "../../../../core/services/auth/auth-social.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/services/auth/auth.service";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Subscription} from "rxjs";
import {environment} from "../../../../../environments/enviroment";

@Component({
  selector: 'app-auth-form-layout',
  templateUrl: './auth-form-layout.component.html',
  styleUrls: ['./auth-form-layout.component.css']
})
export class AuthFormLayoutComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() showExtraFeatures: boolean = true;
  private authSub!: Subscription;

  constructor(
    private socialAuthService: SocialAuthService,
    private authSocialService: AuthSocialService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initGoogleLogin();

    this.authSub = this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user && user.provider === 'GOOGLE') {
        this.handleSocialLogin('google', user.idToken);
      }
    });
  }

  private initGoogleLogin() {
    if ((window as any).google) {
      this.renderGoogleButton();
    } else {
      // ✅ Chờ script load xong
      const interval = setInterval(() => {
        if ((window as any).google) {
          clearInterval(interval);
          this.renderGoogleButton();
        }
      }, 100);
    }
  }

  private renderGoogleButton() {
    (window as any).google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        console.log('Google callback response:', response);
        console.log('credential:', response?.credential);
        if (response.credential) {
          this.handleSocialLogin('google', response.credential);
        }
      }
    });

    setTimeout(() => {
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { theme: 'outline', size: 'large', width: 200 }
      );
    }, 100);
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async onFacebookLogin() {
    try {
      const user = await this.authSocialService.loginWithFacebook();
      this.handleSocialLogin('facebook', user.authToken);
    } catch (err) {
      console.error('Đăng nhập bằng Facebook thất bại', err);
    }
  }

  private handleSocialLogin(provider: 'google' | 'facebook', token: string) {
    console.log('handleSocialLogin called:', provider, token);
    this.authSocialService.sendSocialToken(provider, token).subscribe({
      next: (res) => {
        console.log('BE response:', res);
        if (res.success && res.data) {
          this.authService.saveAuthData(res.data);
          this.router.navigate(['/']);
        }
      },
      error: (err) => console.error('Backend auth failed', err)
    });
  }
}
