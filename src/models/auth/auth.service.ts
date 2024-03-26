import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ResourceNotFoundException, UnauthorizedException } from 'src/common/exceptions/system';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

/**
 * AuthService provides authentication services for users, including signing in, refreshing tokens, and signing up new users.
 */
@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ){}

  /**
   * Signs in a user and returns the user and access and refresh tokens.
   * @param user - The user to sign in.
   * @returns An object containing the user DTO and tokens.
   */
  async signIn(user: User) {
    const payload = this.getJwtPayload(user)
    return { 
      user: this.userService.toDto(user), 
      token: {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.generateNewRefreshToken(user)
    } }
  }

  /**
   * Refreshes the access token using the refresh token.
   * @param accessToken - The current access token.
   * @param refreshToken - The current refresh token.
   * @returns A new access token and refresh token.
   */
  async refreshToken( accessToken: string, refreshToken: string  ) {
    try {
      const { email } = this.jwtService.decode(accessToken);
      const user = await this.userService.findByEmail(email);
  
      if( !user || refreshToken !== user.refreshToken ) throw new UnauthorizedException();

      const response: any = await this.jwtService.verifyAsync(user.refreshToken).catch(() => {});

      if( !response?.email ) throw new UnauthorizedException();

      const { token } = await this.signIn(user);

      return token;
    } catch (err) {
      throw new UnauthorizedException("Tokens provided are invalid.")
    }
  }

  /**
   * Signs up a new user.
   * @param userInput - The user input DTO to create a new user.
   * @returns The user DTO.
   */
  async signUp( userInput: CreateUserDto ) {
    const user = await this.userService.create(userInput);
    return this.userService.toDto(user);
  }

  /**
   * Validates a user's credentials.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The user DTO if valid, otherwise null.
   */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if( !user || !(await this.userService.verifyPassword(user.password, password))) 
      return null;

    return this.userService.toDto(user);
  }

  /**
   * Generates the JWT payload for a user.
   * @param user - The user to generate a payload for.
   * @returns The JWT payload.
   */
  getJwtPayload(user: User) {
    return {sub: user.id, email: user.email};
  }

  /**
   * Generates a new refresh token for a user and sets it in the database.
   * @param user - The user to generate a refresh token for.
   * @returns The new refresh token.
   */
  async generateNewRefreshToken( user: User ) {
    const payload = this.getJwtPayload(user);
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30 days'});
    await this.userService.update(user.id, {refreshToken});
    return refreshToken;
  }
}