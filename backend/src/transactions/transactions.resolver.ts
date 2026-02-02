import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { TransactionsService } from './transactions.service';
import { DepositInput } from './dto/deposit.input';
import { Transaction } from './transactions.schema';
import type { UserDocument } from '../users/user.schema';
import { WithdrawInput } from './dto/withdraw.input';

@Resolver(() => Transaction)
export class TransactionsResolver {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) { }

    @Query(() => Number)
    @UseGuards(JwtAuthGuard)
    getBalance(@CurrentUser() user: UserDocument) {
        return this.transactionsService.getBalance(user);
    }

    @Mutation(() => Transaction)
    @UseGuards(JwtAuthGuard)
    async deposit(
        @CurrentUser() user: UserDocument,
        @Args('input') input: DepositInput,
    ): Promise<Transaction> {
        return this.transactionsService.deposit(user, input.amount);
    }
    @Mutation(() => Transaction)
    @UseGuards(JwtAuthGuard)
    async withdraw(
        @CurrentUser() user: UserDocument,
        @Args('input') input: WithdrawInput,
    ): Promise<Transaction> {
        return this.transactionsService.withdraw(user, input.amount);
    }
    @Query(() => [Transaction])
    @UseGuards(JwtAuthGuard)
    getTransactions(@CurrentUser() user: UserDocument): Promise<Transaction[]> {
        return this.transactionsService.getTransactions(user);
    }
}
