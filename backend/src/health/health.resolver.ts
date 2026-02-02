import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.schema';

@Resolver()
export class HealthResolver {
    @Query(() => String)
    health() {
        return 'ok';
    }

    @Query(() => String)
    @UseGuards(JwtAuthGuard)
    protectedHealth(@CurrentUser() user: User) {
        return `Hello ${user.email}`;
    }
}
