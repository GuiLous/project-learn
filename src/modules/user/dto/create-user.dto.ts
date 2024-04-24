import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserCreatableInterface } from '../interfaces';
import { UserDto } from './user.dto';

export class CreateUserDto
  extends IntersectionType(
    PickType(UserDto, ['username', 'firstName', 'lastName', 'email']),
    PartialType(PickType(UserDto, ['active'])),
  )
  implements UserCreatableInterface
{
  @ApiProperty({
    type: 'string',
    title: 'password',
    description: 'The user password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    title: 'salt',
    description: 'The salt for hash password',
  })
  @IsString()
  @IsOptional()
  salt: string;
}
