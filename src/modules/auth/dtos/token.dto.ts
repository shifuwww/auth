import { ApiProperty } from '@nestjs/swagger';
import { TokenInterface } from 'src/shared/interfaces';

export class TokenDto implements TokenInterface {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcsInVzZXJuYW1lIjoiY2h5bmd5eiIsImVtYWlsIjoic2hpZnU1QGdtYWlsLmNvbSIsInJvbGVzIjpbIk1vZGVyYXRvciIsIlN5c3RlbUFkbWluIl0sImlhdCI6MTY5MjcwNzc1NiwiZXhwIjoxNjkzMzEyNTU2fQ.BcFFZzqtSSZMpduL8KJvyBEpu5DYoP3imrffR2TOx8k',
    type: String,
    description: 'access token',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcsInVzZXJuYW1lIjoiY2h5bmd5eiIsImVtYWlsIjoic2hpZnU1QGdtYWlsLmNvbSIsInJvbGVzIjpbIk1vZGVyYXRvciIsIlN5c3RlbUFkbWluIl0sImlhdCI6MTY5MjcwNzc1NiwiZXhwIjoxNjkzMzEyNTU2fQ.BcFFZzqtSSZMpduL8KJvyBEpu5DYoP3imrffR2TOx8k',
    type: String,
    description: 'refresh token',
  })
  refreshToken: string;
}
