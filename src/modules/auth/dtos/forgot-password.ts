import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import {
  ChangePasswordType,
  ForgetPasswordType,
  ValidatePasswordChangeType,
} from 'src/shared/types';

export class ForgetPasswordDto implements ForgetPasswordType {
  @ApiProperty({
    example: 'user@gmail.com',
    type: String,
    description: 'Email of user',
  })
  @IsEmail()
  email: string;
}

export class ValidatePasswordChangeDto implements ValidatePasswordChangeType {
  @ApiProperty({
    example: 'user@gmail.com',
    type: String,
    description: 'Email of user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '111111',
    type: String,
    description: 'Secret code',
  })
  @Length(5, 7)
  @IsString()
  code: string;
}

export class ChangePasswordDto implements ChangePasswordType {
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
  @IsEmail()
  email: string;
}
