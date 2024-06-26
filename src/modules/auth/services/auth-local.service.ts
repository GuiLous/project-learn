import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class AuthLocalService extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string) {
    return this.authService.validateUserPassword(username, password);
  }
}
