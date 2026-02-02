import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from './transactions.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name)
        private readonly transactionModel: Model<TransactionDocument>,
    ) { }
    async getBalance(user: User): Promise<number> {
        return user.balance;
    }
    async deposit(user: UserDocument, amount: number): Promise<Transaction> {
        if (amount <= 0) {
            throw new BadRequestException('Invalid amount');
        }

        const session = await this.transactionModel.db.startSession();
        session.startTransaction();

        try {
            // update user balance
            user.balance += amount;
            await user.save({ session });
            // create transaction record
            const transaction = new this.transactionModel({
                type: TransactionType.DEPOSIT,
                amount,
                balanceAfter: user.balance,
                user: user._id,
            });

            await transaction.save({ session });
            // commit transaction
            await session.commitTransaction();
            session.endSession();

            return transaction;
        } catch (error) {
            //Rollback EVERYTHING
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async withdraw(user: UserDocument, amount: number): Promise<Transaction> {
        if (amount <= 0) {
            throw new BadRequestException('Invalid amount');
        }

        if (amount > user.balance) {
            throw new BadRequestException('Insufficient balance');
        }

        const session = await this.transactionModel.db.startSession();
        session.startTransaction();

        try {
            // update user balance
            user.balance -= amount;
            await user.save({ session });

            // create transaction record
            const transaction = new this.transactionModel({
                type: TransactionType.WITHDRAWAL,
                amount,
                balanceAfter: user.balance,
                user: user._id,
            });

            await transaction.save({ session });

            // commit transaction
            await session.commitTransaction();
            session.endSession();

            return transaction;
        } catch (error) {
            //Rollback EVERYTHING
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async getTransactions(user: UserDocument): Promise<Transaction[]> {
        return this.transactionModel
            .find({ user: user._id })
            .sort({ createdAt: -1 })
            .exec();
    }


}
