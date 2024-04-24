import { LoggerConfigInterface } from '@/modules/logger/interfaces';
import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { LOGGER_CONFIG } from '../constants';
import { env } from '../env';

export const loggerConfig = registerAs(
  LOGGER_CONFIG,
  (): LoggerConfigInterface => ({
    logLevel: env.LOG_LEVEL ? splitLogLevel(env.LOG_LEVEL) : ['error'],
    transportLogLevel: env.TRANSPORT_LOG_LEVEL
      ? splitLogLevel(env.TRANSPORT_LOG_LEVEL)
      : ['error'],
  }),
);

function splitLogLevel(levels: string): LogLevel[] {
  const levelTypes: string[] = levels.split(',');

  return levelTypes.map((levelType) => {
    return levelType.trim() as LogLevel;
  });
}
