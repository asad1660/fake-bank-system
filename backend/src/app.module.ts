import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { ConfigModule } from './config/config.module';
import { HealthResolver } from './health/health.resolver';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    // Global environment configuration
    ConfigModule,
    UsersModule,
    AuthModule,
    TransactionsModule,
    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URI as string),

    // GraphQL configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),

    }),
  ],
  providers: [HealthResolver, JwtStrategy],
})
export class AppModule { }
