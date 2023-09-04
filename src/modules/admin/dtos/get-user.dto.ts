import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/shared/enums';
import { GetUserByAdminType } from 'src/shared/types';

export class GetUserByAdminDto implements GetUserByAdminType {
  @ApiProperty({
    example: '22bd16ae-5f87-4c35-9a1a-9487eee61a38',
    type: String,
    description: 'id of user',
  })
  id: string;

  @ApiProperty({
    example: UserRoleEnum.User,
    enum: UserRoleEnum,
    enumName: 'UserRoleEnum',
    description: 'username of user',
  })
  role: UserRoleEnum;

  @ApiProperty({
    example: 'player1',
    type: String,
    description: 'username of user',
  })
  username: string;

  @ApiProperty({
    example: 'user@gmail.com',
    type: String,
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    example: '2023-09-03 21:24:25.39539+07',
    type: String,
    description: 'Date of create',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-09-03 21:24:25.39539+07',
    type: String,
    description: 'Date of update',
  })
  updatedAt: Date;
}
