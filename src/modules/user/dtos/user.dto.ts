import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/base';
import { UserRoleEnum } from 'src/shared/enums';
import { CreateUserType, GetUserType } from 'src/shared/types';

export class CreateUserDto extends BaseDto implements CreateUserType {
  @ApiProperty({
    example: 'Player1',
    type: String,
    description: 'Username',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @ApiProperty({
    example: 'qwerty123321',
    type: String,
    description: 'Password of user',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'user@gmail.com',
    type: String,
    description: 'Email of user',
  })
  email: string;
}

export class GetUserDto implements GetUserType {
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
}
