import { loggerSentryConfig } from '@/common/config';
import { Inject, Injectable, LogLevel } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { LoggerTransportInterface } from '../interfaces';

@Injectable()
export class LoggerSentryTransportService implements LoggerTransportInterface {
  constructor(
    @Inject(loggerSentryConfig.KEY)
    private config: ConfigType<typeof loggerSentryConfig>,
  ) {
    Sentry.init({
      dsn: this.config.dsn,
    });
  }

  log(message: string, logLevel: LogLevel, error?: Error | string): void {
    const severity = this.config.logLevelMap(logLevel);

    if (error) {
      Sentry.captureException(error, {
        level: severity,
        extra: { developerMessage: message },
      });
      return;
    }

    Sentry.captureMessage(message, severity);
  }
}
