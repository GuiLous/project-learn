import { Roles } from '@/modules/role/decorators';
import { RoleEnum } from '@/modules/role/enum';
import { RolesGuard } from '@/modules/role/guards';
import { UserDto } from '@/modules/user/dto';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../decorators';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  signIn(@AuthUser() user: UserDto) {
    return this.authService.jwtSign(user);
  }

  @Post('user')
  @Roles(RoleEnum.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  user(@AuthUser() user: UserDto) {
    return user;
  }

  @Post('admin')
  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  admin(@AuthUser() user: UserDto) {
    return user;
  }
}
