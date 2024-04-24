import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from '../services';

@Injectable()
export class LoggerRequestInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private loggerService: LoggerService) {}

  intercept(
    _context: ExecutionContext,
    _next: CallHandler,
  ): Observable<Response<T>> {
    const req: Request = _context.switchToHttp().getRequest();
    const res: Response = _context.switchToHttp().getResponse();
    const startDate = new Date();

    this.loggerService.setContext(_context.getClass().name);

    const message = this.loggerService.formatRequestMessage(req);

    this.loggerService.log(message);

    return _next.handle().pipe(
      tap(() => this.responseSuccess(req, res, startDate)),
      catchError((error: Error) =>
        this.responseError(req, res, startDate, error),
      ),
    );
  }

  responseSuccess(req: Request, res: Response, startDate: Date) {
    const message = this.loggerService.formatResponseMessage(
      req,
      res,
      startDate,
    );
    this.loggerService.log(message);
  }

  responseError(req: Request, res: Response, startDate: Date, error: Error) {
    const message = this.loggerService.formatResponseMessage(
      req,
      res,
      startDate,
      error,
    );

    this.loggerService.exception(error, message);

    return throwError(() => error);
  }
}
