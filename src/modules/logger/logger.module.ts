import { loggerConfig, loggerSentryConfig } from '@/common/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerExceptionFilter } from './filters';
import { LoggerRequestInterceptor } from './interceptors';
import {
  LoggerSentryTransportService,
  LoggerService,
  LoggerTransportService,
} from './services';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(loggerConfig),
    ConfigModule.forFeature(loggerSentryConfig),
  ],
  providers: [
    LoggerService,
    LoggerTransportService,
    LoggerSentryTransportService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerRequestInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggerExceptionFilter,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
