import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'src/shared/enums';

export class StatusDto {
  @ApiProperty({
    example: StatusEnum.DONE,
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'Status of request',
  })
  status: StatusEnum;
}
