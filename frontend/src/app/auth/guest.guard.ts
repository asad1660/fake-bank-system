import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    // If already logged in → redirect to dashboard
    if (this.tokenService.hasToken()) {
      return this.router.createUrlTree(['/dashboard']);
    }

    // Otherwise allow access to login/register
    return true;
  }
}
