import { CommonEntityDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { RoleInterface } from '../interfaces';

@Exclude()
export class RoleDto extends CommonEntityDto implements RoleInterface {
  @ApiProperty({
    type: 'string',
    description: 'Role',
  })
  @IsString()
  @Expose()
  name: string;
}
