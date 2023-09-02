import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ActivateRegisterInterface,
  RegisterInterface,
} from 'src/shared/interfaces';
import { UserRole } from 'src/shared/enums';

export class RegisterDto implements RegisterInterface {
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

  role: UserRole[] = [];
}

export class ActivateRegisterDto implements ActivateRegisterInterface {
  @ApiProperty({
    example: '111111',
    type: String,
    description: 'Secret code',
  })
  @Length(5, 7)
  @IsString()
  code: string;

  @ApiProperty({
    example: 'Player1',
    type: String,
    description: 'Username',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;
}
