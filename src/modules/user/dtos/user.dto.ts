import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/base';
import { CreateUserType } from 'src/shared/types';

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
    example: 'user@gmail.come',
    type: String,
    description: 'Email of user',
  })
  email: string;
}
