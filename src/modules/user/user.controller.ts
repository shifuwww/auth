import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAtJwtInterface } from 'src/shared/interfaces';
import { AtGuard } from '../auth/guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserDto } from './dtos';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AtGuard)
  @ApiResponse({
    status: 200,
    description: 'Got user info',
    type: GetUserDto,
  })
  @ApiOperation({ summary: 'Get user info' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Get('get')
  public getUserByToken(@Req() request: any): Promise<GetUserDto> {
    const user = request.user as UserAtJwtInterface;
    return this._userService.getOneById(user.id, [
      'username',
      'email',
      'role',
      'createdAt',
    ]);
  }
}
