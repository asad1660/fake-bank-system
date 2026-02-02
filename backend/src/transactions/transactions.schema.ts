import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
}

registerEnumType(TransactionType, {
    name: 'TransactionType',
});
export type TransactionDocument = Transaction & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Transaction {
    @Field(() => ID)
    _id: string;

    @Field(() => TransactionType)
    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;


    @Field()
    @Prop({ required: true })
    amount: number;

    @Field()
    @Prop({ required: true })
    balanceAfter: number;

    @Field(() => Date)
    createdAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: User | Types.ObjectId | string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
