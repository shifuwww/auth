import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ActivateRegisterDto,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  RegisterDto,
  ResendActivateMailDto,
  StatusDto,
  TokenDto,
  ValidatePasswordChangeDto,
} from './dtos';
import { UserAtJwtInterface, UserRtJwtInterface } from 'src/shared/interfaces';
import { AtGuard, RtGuard } from './guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'User login in',
    type: TokenDto,
  })
  @ApiOperation({ summary: 'user login' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this._authService.login(loginDto);
  }

  @ApiResponse({
    status: 200,
    description: 'user logout',
    type: StatusDto,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'user logout' })
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public logout(@Req() request: any): Promise<StatusDto> {
    const user = request.user as UserAtJwtInterface;
    return this._authService.logout(user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Request created',
    type: StatusDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create registration request' })
  @Post('register')
  public register(@Body() registerDto: RegisterDto): Promise<StatusDto> {
    return this._authService.register(registerDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Tokens updated',
    type: TokenDto,
  })
  @ApiOperation({ summary: 'Update tokens by refresh token' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @ApiBearerAuth()
  @Post('refresh')
  public refresh(@Req() request: any): Promise<TokenDto> {
    const user = request.user as UserRtJwtInterface;
    return this._authService.refresh({ refreshToken: user.refreshToken });
  }

  @ApiResponse({
    status: 201,
    description: 'Registration finished successfully',
    type: TokenDto,
  })
  @ApiOperation({ summary: 'Finish registration' })
  @HttpCode(HttpStatus.CREATED)
  @Post('activate-account')
  public activateAccount(
    @Body() activateRegisterDto: ActivateRegisterDto,
  ): Promise<TokenDto> {
    return this._authService.activateAccount(activateRegisterDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Activation email sended',
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Resend registration request' })
  @HttpCode(HttpStatus.OK)
  @Post('activate-account-resend')
  public resendActivate(
    @Body() resendActivateMailDto: ResendActivateMailDto,
  ): Promise<StatusDto> {
    return this._authService.resendActivateMailCode(resendActivateMailDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Request created',
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Create password recovery request' })
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  public forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<StatusDto> {
    return this._authService.forgetPassword(forgetPasswordDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Recovery password mail sended',
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Resend password recovery request' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-recovery-password')
  public resendRecoveryPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<StatusDto> {
    return this._authService.resendRecoveryPassword(forgetPasswordDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Request is valid',
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Check password recovery request' })
  @HttpCode(HttpStatus.OK)
  @Post('validate-password')
  public validatePasswordChange(
    @Body() validatePasswordChangeDto: ValidatePasswordChangeDto,
  ): Promise<StatusDto> {
    return this._authService.validatePasswordChange(validatePasswordChangeDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  public changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<StatusDto> {
    return this._authService.changePassword(changePasswordDto);
  }
}
