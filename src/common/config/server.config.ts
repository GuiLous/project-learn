import { registerAs } from '@nestjs/config';
import { SERVER_CONFIG } from '../constants';
import { env } from '../env';
import { ServerConfigInterface } from '../interfaces';

export const serverConfig = registerAs(
  SERVER_CONFIG,
  (): ServerConfigInterface => ({
    environment: env.NODE_ENV,
    port: parseInt(env.PORT),
    cors: {
      origin: env.CORS_ORIGIN,
    },
  }),
);
