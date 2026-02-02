import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Field()
    @Prop({ default: 0 })
    balance: number;

    get id(): string {
        return this._id;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
