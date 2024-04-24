import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),
  CORS_ORIGIN: z.string().default('http://localhost:300'),
  DB_URL: z
    .string()
    .default('postgresql://postgres:123456@localhost:5432/testdb'),
  DB_MIGRATIONS_RUN: z.string().default('true'),
  DB_SYNC: z.string().default('true'),
  JWT_SECRET: z.string().default('there is no secret'),
  JWT_ACCESS_EXPIRES: z.string().default('1h'),
  JWT_REFRESH_EXPIRES: z.string().default('1y'),
  HASH_SALT: z.string().default('10'),
  SENTRY_DSN: z.string().default(''),
  LOG_LEVEL: z.string().default('error'),
  TRANSPORT_LOG_LEVEL: z.string().default('error'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('\nInvalid environment variables!', _env.error.format(), '\n');

  throw new Error('Invalid environment variables!');
}

export const env = _env.data;
