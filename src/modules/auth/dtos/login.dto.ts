import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginInterface } from 'src/shared/interfaces';

export class LoginDto implements LoginInterface {
  @ApiProperty({
    example: 'Player1',
    type: String,
    description: 'Username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'qwerty123321',
    type: String,
    description: 'Password of user',
  })
  @IsString()
  password: string;
}
