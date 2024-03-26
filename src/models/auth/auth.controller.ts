import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @Post("register")
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("refresh-token")
  async refreshToken(@Request() request: any) {
    const [_, token] = request.headers.authorization.split(" ");
    return this.authService.refreshToken(token, request.body.refreshToken)
  }
}
