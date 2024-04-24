import { LoggerSentryConfigInterface } from '@/modules/logger/interfaces';
import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { SeverityLevel } from '@sentry/types';
import { LOGGER_SENTRY_CONFIG } from '../constants';
import { env } from '../env';

export const loggerSentryConfig = registerAs(
  LOGGER_SENTRY_CONFIG,
  (): LoggerSentryConfigInterface => ({
    dsn: env.SENTRY_DSN,
    logLevelMap: (logLevel: LogLevel): SeverityLevel => {
      switch (logLevel) {
        case 'error':
          return 'error';
        case 'debug':
          return 'debug';
        case 'log':
          return 'log';
        case 'warn':
          return 'warning';
        case 'verbose':
          return 'info';
      }
    },
  }),
);
