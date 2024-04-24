import { ErrorCodeExceptionInterface } from '@/common/interfaces';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException
  extends NotFoundException
  implements ErrorCodeExceptionInterface
{
  errorCode: string;

  constructor() {
    super('User was not found');
    this.errorCode = 'USER_001';
  }
}
