import { LogLevel } from '@nestjs/common';
import { SeverityLevel } from '@sentry/types';

export interface LoggerSentryConfigInterface {
  dsn: string;
  logLevelMap: (logLevel: LogLevel) => SeverityLevel;
}
