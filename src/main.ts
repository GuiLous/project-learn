import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './common/config';
import { swagger } from './common/doc';
import { ErrorCodeExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import {
  LoggerSentryTransportService,
  LoggerService,
} from './modules/logger/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorCodeExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const customLoggerService = app.get(LoggerService);
  const loggerSentryTransportService = app.get(LoggerSentryTransportService);

  customLoggerService.addTransport(loggerSentryTransportService);
  customLoggerService.setContext('bootstrap');

  swagger(app);

  await app.listen(serverConfig().port, () => {
    console.log(`\nserver running on port ${serverConfig().port}! 🚀`);
  });
}
bootstrap();
