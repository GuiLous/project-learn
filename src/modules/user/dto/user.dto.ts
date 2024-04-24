import { CommonEntityDto } from '@/common/dto';
import { Role } from '@/modules/role/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserInterface } from '../interfaces';

@Exclude()
export class UserDto
  extends CommonEntityDto
  implements Omit<UserInterface, 'salt' | 'password'>
{
  @ApiProperty({
    type: 'string',
    title: 'username',
    description: 'The username of the user',
    minLength: 3,
    maxLength: 12,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @Expose()
  username: string;

  @ApiProperty({
    type: 'string',
    title: 'firstName',
    description: 'The first name name of the user',
  })
  @IsString()
  @Expose()
  firstName: string;

  @ApiProperty({
    type: 'string',
    title: 'lastName',
    description: 'The last name of the user',
  })
  @IsString()
  @Expose()
  lastName: string;

  @ApiProperty({
    type: 'string',
    title: 'Email',
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    type: 'boolean',
    title: 'Active',
    description: 'The flag to inform the user is active',
  })
  @Expose()
  @IsBoolean()
  @Type(() => Boolean)
  active: boolean;

  @ApiProperty({
    type: ['string'],
    description: 'roles',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    return value?.map((role: Role) => {
      return role.name;
    });
  })
  roles: string[];
}
