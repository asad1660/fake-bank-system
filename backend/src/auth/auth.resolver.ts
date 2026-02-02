import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => Boolean)
    async register(@Args('input') input: RegisterInput): Promise<boolean> {
        await this.authService.register(input.email, input.password);
        return true;
    }

    @Mutation(() => AuthPayload)
    login(@Args('input') input: LoginInput): Promise<AuthPayload> {
        return this.authService.login(input.email, input.password);
    }
}
