import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TransactionType } from './transactions.schema';

describe('TransactionsResolver', () => {
    let resolver: TransactionsResolver;

    const transactionsServiceMock = {
        getBalance: jest.fn(),
        deposit: jest.fn(),
        withdraw: jest.fn(),
        getTransactions: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsResolver,
                {
                    provide: TransactionsService,
                    useValue: transactionsServiceMock,
                },
            ],
        }).compile();

        resolver = module.get<TransactionsResolver>(TransactionsResolver);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return balance from service', async () => {
        transactionsServiceMock.getBalance.mockResolvedValue(100);

        const result = await resolver.getBalance({ balance: 100 } as any);

        expect(result).toBe(100);
        expect(transactionsServiceMock.getBalance).toHaveBeenCalled();
    });

    it('should call deposit on service', async () => {
        transactionsServiceMock.deposit.mockResolvedValue({
            type: TransactionType.DEPOSIT,
            amount: 50,
            balanceAfter: 150,
        });

        const result = await resolver.deposit(
            { balance: 100 } as any,
            { amount: 50 },
        );

        expect(result.type).toBe(TransactionType.DEPOSIT);
        expect(transactionsServiceMock.deposit).toHaveBeenCalledWith(
            expect.anything(),
            50,
        );
    });

    it('should call withdraw on service', async () => {
        transactionsServiceMock.withdraw.mockResolvedValue({
            type: TransactionType.WITHDRAWAL,
            amount: 40,
            balanceAfter: 60,
        });

        const result = await resolver.withdraw(
            { balance: 100 } as any,
            { amount: 40 },
        );

        expect(result.type).toBe(TransactionType.WITHDRAWAL);
        expect(transactionsServiceMock.withdraw).toHaveBeenCalledWith(
            expect.anything(),
            40,
        );
    });

    it('should return transactions list', async () => {
        const transactions = [
            { type: TransactionType.DEPOSIT, amount: 100 },
            { type: TransactionType.WITHDRAWAL, amount: 50 },
        ];

        transactionsServiceMock.getTransactions.mockResolvedValue(transactions);

        const result = await resolver.getTransactions({} as any);

        expect(result).toHaveLength(2);
        expect(transactionsServiceMock.getTransactions).toHaveBeenCalled();
    });
});
