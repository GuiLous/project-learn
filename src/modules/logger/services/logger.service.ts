import { ConsoleLogger, HttpException, Injectable } from '@nestjs/common';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { Request, Response } from 'express';
import { LoggerTransportInterface } from '../interfaces';
import { LoggerTransportService } from './logger-transports.service';


@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private transportService: LoggerTransportService) {
    super();
  }

  exception(error: Error, message?: string, context?: string | undefined) {
    if (!message) {
      message = error.message;
    }

    if (
      error instanceof HttpException &&
      error.getStatus() >= 400 &&
      error.getStatus() < 500
    ) {
      super.debug(message, context);
      this.transportService.log(message, 'debug' as LogLevel, error);
      return
    }

    super.error(message, error.stack, context);
    this.transportService.log(message, 'error' as LogLevel, error);
  }

  error(
    message: string,
    trace?: string | undefined,
    context?: string | undefined
  ): void {
    super.error(message, trace, context);
    if (trace) {
      const error = new Error(message);
      error.stack = trace;
      this.transportService.log(message, 'error' as LogLevel, error);
      return 
    }
    
    this.transportService.log(message, 'error' as LogLevel);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.transportService.log(message, 'warn' as LogLevel);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.transportService.log(message, 'debug' as LogLevel);
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.transportService.log(message, 'log' as LogLevel);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.transportService.log(message, 'verbose' as LogLevel);
  }

  formatRequestMessage(req: Request): string {
    const { method, url } = req;
    const now = new Date();

    return `${now.toISOString()} ${method} ${url}`;
  }

  formatResponseMessage(
    req: Request,
    res: Response,
    startDate: Date,
    error?: Error,
  ): string {
    const { method, url } = req;
    const now = new Date();

    return (
      `${now.toISOString()} ${method} ${url} ${res.statusCode} ` +
      `${now.getTime() - startDate.getTime()}ms` +
      (error ? ` - ${error}` : '')
    );
  }

  addTransport(transport: LoggerTransportInterface) {
    this.transportService.addTransport(transport);
  }
}