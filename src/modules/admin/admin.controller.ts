import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserByAdminDto } from './dtos';
import { Roles } from '../auth/decorators';
import { UserRoleEnum } from 'src/shared/enums';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly _adminService: AdminService) {}

  @ApiBearerAuth()
  @Roles(UserRoleEnum.Admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Got user info',
    type: GetUserByAdminDto,
  })
  @ApiOperation({ summary: 'Get user info' })
  @HttpCode(HttpStatus.OK)
  @Get('user/get-all')
  public getAllUSers() {
    return this._adminService.getAllUsers();
  }
}
