import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: any) {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
}
