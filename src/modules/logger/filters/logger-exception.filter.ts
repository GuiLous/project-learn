import { ArgumentsHost, Catch, Inject, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerService } from '../services';

@Catch()
@Injectable()
export class LoggerExceptionFilter extends BaseExceptionFilter {
  @Inject(LoggerService)
  private loggerService!: LoggerService;

  catch(exception: Error, host: ArgumentsHost) {
    this.loggerService.exception(
      exception,
      undefined,
      LoggerExceptionFilter.name,
    );
    super.catch(exception, host);
  }
}
