import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({
      uri: environment.graphqlUrl,
    }),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = {
  provide: APOLLO_OPTIONS,
  useFactory: createApollo,
  deps: [HttpLink],
};
