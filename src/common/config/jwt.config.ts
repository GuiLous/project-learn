import { registerAs } from '@nestjs/config';
import { JWT_MODULE_CONFIG } from '../constants';
import { env } from '../env';
import { JwtConfigInterface } from '../interfaces';

export const jwtConfig = registerAs(
  JWT_MODULE_CONFIG,
  (): JwtConfigInterface => ({
    secret: env.JWT_SECRET,
    access: {
      signOptions: {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      },
    },
    refresh: {
      signOptions: {
        expiresIn: env.JWT_REFRESH_EXPIRES,
      },
    },
  }),
);
