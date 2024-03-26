import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

/**
 * LocalStrategy class extends PassportStrategy and uses the AuthService to validate a user's credentials.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user credentials.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The validated user object or throws an UnauthorizedException.
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Authentication failed. Please check your login details and try again.");
    }

    return user;
  }
}
