import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RoleCreatableInterface } from '../interfaces';

export class CreateRoleDto implements RoleCreatableInterface {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  name: string;
}
