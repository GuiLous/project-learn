import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CommonEntityDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    title: 'Id',
    description: 'The primary key',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    title: 'Created At',
    description: 'The date and time with was created',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    title: 'Created At',
    description: 'The date and time with was updated',
  })
  @Expose()
  updatedAt: Date;
}
