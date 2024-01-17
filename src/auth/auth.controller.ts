// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const validatedUser = await this.authService.validateUser(
      createAuthDto.email,
      createAuthDto.password,
    );

    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(validatedUser);
  }
}
