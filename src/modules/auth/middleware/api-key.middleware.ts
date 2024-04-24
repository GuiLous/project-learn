import { API_KEY_HEADER } from '@/common/constants';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers[API_KEY_HEADER] !== 'API_KEY')
      throw new UnauthorizedException('API KEY is missing');
    next();
  }
}
