import { jwtConfig } from '@/common/config';
import { UserDto } from '@/modules/user/dto';
import { UserService } from '@/modules/user/services';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from '../dto';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private config: ConfigType<typeof jwtConfig>,
  ) {}

  public async validateUserPassword(username: string, password: string) {
    const userAuthenticated = await this.usersService.validateUserPassword(
      username,
      password,
    );

    if (!userAuthenticated)
      throw new UnauthorizedException('the username or password is invalid');

    return userAuthenticated;
  }

  public async jwtSign(user: UserDto): Promise<AuthResponseDto> {
    const accessConfig = this.config.access;
    const refreshConfig = this.config.refresh;

    const payload: JwtPayload = { sub: user.id };

    const accessToken = this.jwtService.sign(
      payload,
      accessConfig?.signOptions,
    );

    const refreshToken = this.jwtService.sign(
      payload,
      refreshConfig?.signOptions,
    );

    return new AuthResponseDto(accessToken, refreshToken);
  }
}
