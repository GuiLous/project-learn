import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TYPEORM_MODULE_CONFIG } from '../constants';
import { env } from '../env';

export const typeOrmConfig = registerAs(
  TYPEORM_MODULE_CONFIG,
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: env.DB_URL,
    migrationsRun: Boolean(env.DB_MIGRATIONS_RUN),
    entities: [__dirname + '/../**/*.entity.{js, ts}'],
    subscribers: [],
    synchronize: Boolean(env.DB_SYNC),
    migrations: [__dirname + '/../migrations/*.{js, ts}'],
    autoLoadEntities: true,
    logging: true,
    logger: 'file',
  }),
);
