import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UnauthorizedException } from 'src/common/exceptions/system';


/**
 * UserController is a controller class that handles user-related requests.
 * It uses the UserService to interact with the user data.
 * All endpoints in this controller are protected by the JwtAuthGuard.
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  /**
   * Returns the logged-in user's information.
   * @param req - The request object containing the user's email.
   * @returns The user's DTO.
   */
  @Get("me")
  async getLoggedInUser(@Request() req: any) {
    const user = await this.userService.findByEmail(req.user.email);
    if( !user ) throw new UnauthorizedException();
    return this.userService.toDto(user);
  }
}