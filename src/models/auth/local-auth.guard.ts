import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard is a custom authentication guard that extends the built-in
 * AuthGuard provided by NestJS. It uses the 'local' strategy for authentication,
 * which involves verifying a username and password combination.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}