import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from './transactions.schema';
import { BadRequestException } from '@nestjs/common';
import { TransactionType } from './transactions.schema';

describe('TransactionsService', () => {
    let service: TransactionsService;

    const transactionModelMock = jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
            type: TransactionType.DEPOSIT,
            amount: 50,
            balanceAfter: 100,
        }),
    }));

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                {
                    provide: getModelToken(Transaction.name),
                    useValue: transactionModelMock,
                },
            ],
        }).compile();

        service = module.get<TransactionsService>(TransactionsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user balance', async () => {
        const user: any = { balance: 100 };
        expect(await service.getBalance(user)).toBe(100);
    });

    it('should deposit amount and create transaction', async () => {
        const user: any = {
            balance: 50,
            save: jest.fn(),
            _id: 'user-id',
        };

        const result = await service.deposit(user, 50);

        expect(user.balance).toBe(100);
        expect(user.save).toHaveBeenCalled();
        expect(result.type).toBe(TransactionType.DEPOSIT);
    });

    it('should throw error for invalid deposit amount', async () => {
        const user: any = { balance: 100 };

        await expect(service.deposit(user, -10)).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should withdraw amount and create transaction', async () => {
        const user: any = {
            balance: 100,
            save: jest.fn(),
            _id: 'user-id',
        };

        const result = await service.withdraw(user, 40);

        expect(user.balance).toBe(60);
        expect(user.save).toHaveBeenCalled();
        expect(result.type).toBe(TransactionType.DEPOSIT); // mocked return
    });

    it('should throw error if withdrawing more than balance', async () => {
        const user: any = { balance: 30 };

        await expect(service.withdraw(user, 100)).rejects.toThrow(
            BadRequestException,
        );
    });
});
