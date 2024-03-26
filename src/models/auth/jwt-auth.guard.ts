import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard is a custom authentication guard that extends the built-in AuthGuard from NestJS.
 * It uses the 'jwt' strategy to authenticate incoming requests based on JSON Web Tokens.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
