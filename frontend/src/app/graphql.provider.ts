import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { SetContextLink } from '@apollo/client/link/context';
import { TokenService } from './auth/token.service';
import { environment } from '../environments/environment';

export function createApollo(httpLink: HttpLink, tokenService: TokenService) {
  const http = httpLink.create({
    uri: environment.graphqlUrl,
  });

  const authLink = new SetContextLink((operation, prevContext: any) => {
    const token = tokenService.getToken();
    let headers = prevContext.headers || new HttpHeaders();

    if (!(headers instanceof HttpHeaders)) {
      headers = new HttpHeaders(headers);
    }

    return {
      headers: headers.set('Authorization', token ? `Bearer ${token}` : ''),
    };
  });

  return {
    link: authLink.concat(http),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = {
  provide: APOLLO_OPTIONS,
  useFactory: createApollo,
  deps: [HttpLink, TokenService],
};
