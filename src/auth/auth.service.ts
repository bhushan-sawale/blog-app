// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // console.log('🚀 ~ AuthService ~ validateUser ~ user:', user);

    if (user && (await bcrypt.compare(password, user[0].user_password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
