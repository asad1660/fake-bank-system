import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
  GET_BALANCE_QUERY,
  DEPOSIT_MUTATION,
  WITHDRAW_MUTATION,
  GET_TRANSACTIONS_QUERY,
} from './dashboard.graphql';

type GetBalanceResult = { getBalance: number };

type TransactionResult = {
  _id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  balanceAfter: number;
  createdAt: string;
};
export interface Transaction {
  _id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apollo: Apollo) {}

  getBalance() {
    return this.apollo
      .watchQuery<GetBalanceResult>({
        query: GET_BALANCE_QUERY,
        fetchPolicy: 'network-only', // fresh balance after mutations......
      })
      .valueChanges.pipe(map((res) => res.data?.getBalance ?? null));
  }

  deposit(amount: number) {
    return this.apollo.mutate<{ deposit: TransactionResult }>({
      mutation: DEPOSIT_MUTATION,
      variables: { amount },
    });
  }

  withdraw(amount: number) {
    return this.apollo.mutate<{ withdraw: TransactionResult }>({
      mutation: WITHDRAW_MUTATION,
      variables: { amount },
    });
  }
  getTransactions() {
    return this.apollo
      .watchQuery<{ getTransactions: Transaction[] }>({
        query: GET_TRANSACTIONS_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((res) =>
          (res.data?.getTransactions ?? []).map((t) => ({
            _id: t._id!,
            type: t.type!,
            amount: t.amount!,
            balanceAfter: t.balanceAfter!,
            createdAt: t.createdAt!,
          })),
        ),
      );
  }
}
