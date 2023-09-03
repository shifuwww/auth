import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ActivateRegisterDto,
  LoginDto,
  RegisterDto,
  ResendActivateMailDto,
} from './dtos';
import { UserAtJwtInterface, UserRtJwtInterface } from 'src/shared/interfaces';
import { AtGuard, RtGuard } from './guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  ValidatePasswordChangeDto,
} from './dtos/forgot-password';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  public login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto);
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Post('logout')
  public logout(@Req() request: any) {
    const user = request.user as UserAtJwtInterface;
    return this._authService.logout(user.id);
  }

  @Post('register')
  public register(@Body() registerDto: RegisterDto) {
    return this._authService.register(registerDto);
  }

  @UseGuards(RtGuard)
  @ApiBearerAuth()
  @Post('refresh')
  public refresh(@Req() request: any) {
    const user = request.user as UserRtJwtInterface;
    return this._authService.refresh({ refreshToken: user.refreshToken });
  }

  @Post('activate-account')
  public activateAccount(@Body() activateRegisterDto: ActivateRegisterDto) {
    return this._authService.activateAccount(activateRegisterDto);
  }

  @Post('activate-account-resend')
  public resendActivate(@Body() resendActivateMailDto: ResendActivateMailDto) {
    return this._authService.resendActivateMailCode(resendActivateMailDto);
  }

  @Post('forget-password')
  public forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this._authService.forgetPassword(forgetPasswordDto);
  }

  @Post('resend-recovery-password')
  public resendRecoveryPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this._authService.resendRecoveryPassword(forgetPasswordDto);
  }

  @Post('validate-password')
  public validatePasswordChange(
    @Body() validatePasswordChangeDto: ValidatePasswordChangeDto,
  ) {
    return this._authService.validatePasswordChange(validatePasswordChangeDto);
  }

  @Post('change-password')
  public changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this._authService.changePassword(changePasswordDto);
  }
}
