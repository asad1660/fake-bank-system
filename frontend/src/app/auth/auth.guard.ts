import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanMatch {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  private checkAuth(): boolean | UrlTree {
    return this.tokenService.hasToken()
      ? true
      : this.router.createUrlTree(['/login']);
  }

  canActivate(): boolean | UrlTree {
    return this.checkAuth();
  }

  canMatch(): boolean | UrlTree {
    return this.checkAuth();
  }
}
