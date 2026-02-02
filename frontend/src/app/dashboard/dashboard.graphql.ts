import { gql } from '@apollo/client/core';

export const GET_BALANCE_QUERY = gql`
  query GetBalance {
    getBalance
  }
`;

export const DEPOSIT_MUTATION = gql`
  mutation Deposit($amount: Float!) {
    deposit(input: { amount: $amount }) {
      _id
      type
      amount
      balanceAfter
      createdAt
    }
  }
`;

export const WITHDRAW_MUTATION = gql`
  mutation Withdraw($amount: Float!) {
    withdraw(input: { amount: $amount }) {
      _id
      type
      amount
      balanceAfter
      createdAt
    }
  }
`;
export const GET_TRANSACTIONS_QUERY = gql`
  query GetTransactions {
    getTransactions {
      _id
      type
      amount
      balanceAfter
      createdAt
    }
  }
`;
