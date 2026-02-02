import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DepositInput {
    @Field()
    amount: number;
}
