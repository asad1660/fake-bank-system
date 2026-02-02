import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN_MUTATION, REGISTER_MUTATION } from './auth.graphql';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.apollo
      .mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { email, password },
        },
      })
      .pipe(
        map((result: any) => {
          const token = result.data.login.accessToken;
          this.tokenService.setToken(token);
          return token;
        }),
      );
  }

  register(email: string, password: string) {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: { email, password },
      },
    });
  }

  logout(): void {
    this.tokenService.clearToken();
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }
}
