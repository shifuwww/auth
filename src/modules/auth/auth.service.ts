import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  ActivateRegisterDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResendActivateMailDto,
  StatusDto,
  TokenDto,
} from './dtos';
import { generateCode } from 'src/common/utils';
import { HashingService, JwtService, SmtpService } from 'src/shared/modules';
import {
  AccountRedisRepository,
  PasswordRedisRepository,
} from './repositories';
import { CreateUserDto } from '../user/dtos';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  ValidatePasswordChangeDto,
} from './dtos/forgot-password';
import { PasswordStatusEnum, StatusEnum } from 'src/shared/enums';

@Injectable()
export class AuthService {
  private Logger = new Logger(AuthService.name);

  constructor(
    private readonly _accountRedisRepository: AccountRedisRepository,
    private readonly _passwordRedisRepository: PasswordRedisRepository,
    private readonly _hashingService: HashingService,
    private readonly _userService: UserService,
    private readonly _smtpService: SmtpService,
    private readonly _jwtService: JwtService,
  ) {}

  public async login(loginDto: LoginDto): Promise<TokenDto> {
    try {
      const { username, password } = loginDto;

      const user = await this._userService.getUserByUsername(username);

      if (!user) {
        throw new NotFoundException(`User ${username} does not exist`);
      }

      const isPasswordMatches = await this._hashingService.compare(
        password,
        user.password,
      );

      if (!isPasswordMatches) {
        throw new UnauthorizedException('Password or email is incorrect');
      }

      const tokens = await this._jwtService.createJwtToken({
        id: user.id,
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      await this._userService.updateUserToken(user.id, tokens.refreshToken);

      return { ...tokens };
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }

  public async register(registerDto: RegisterDto): Promise<StatusDto> {
    try {
      const { email, username } = registerDto;

      if (await this._userService.getUserByEmail(email)) {
        throw new ConflictException({
          message: 'CONFLICT_ERROR',
          description: `User with email:${email} already exists`,
        });
      }

      if (await this._userService.getUserByUsername(username)) {
        throw new ConflictException({
          message: 'CONFLICT_ERROR',
          description: `User with username:${username} already exists`,
        });
      }

      const code = generateCode();

      registerDto.password = await this._hashingService.hashPassword(
        registerDto.password,
      );

      await this._accountRedisRepository.set({
        ...registerDto,
        code,
      });

      this._smtpService.send(
        registerDto.email,
        `Code to activate account: ${code}`,
      );

      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async logout(id: string): Promise<StatusDto> {
    try {
      await this._userService.updateUserToken(id, null);
      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async activateAccount(
    activateRegisterDto: ActivateRegisterDto,
  ): Promise<TokenDto> {
    try {
      const { username, code } = activateRegisterDto;

      const account = await this._accountRedisRepository.get({ username });

      if (!account) {
        throw new UnauthorizedException({
          message: 'UNAUTHORIZED_ERROR',
          description: `You have not registered yet`,
        });
      }

      if (account.code !== code) {
        throw new UnprocessableEntityException({
          message: 'UNPROCESSABLE_ENTITY_ERROR',
          description: `Passed code does not match`,
        });
      }

      const createUserDto = new CreateUserDto();
      createUserDto.email = account.email;
      createUserDto.username = account.username;
      createUserDto.password = account.password;

      const user = await this._userService.createUser(createUserDto);

      const tokens = await this._jwtService.createJwtToken({
        sub: user.id,
        id: user.id,
        email: user.id,
        username: user.username,
        role: user.role,
      });

      await this._userService.updateUserToken(user.id, tokens.refreshToken);

      return { ...tokens };
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }

  public async resendActivateMailCode(
    resendActivateMailDto: ResendActivateMailDto,
  ): Promise<StatusDto> {
    try {
      const { username } = resendActivateMailDto;

      const account = await this._accountRedisRepository.get({ username });

      if (!account) {
        throw new UnauthorizedException({
          message: 'UNAUTHORIZED_ERROR',
          description: `You have not registered yet`,
        });
      }

      await this._accountRedisRepository.delete({ username });

      const code = generateCode();

      await this._accountRedisRepository.set({
        ...account,
        code,
      });

      this._smtpService.send(
        account.email,
        `Code to activate account: ${code}`,
      );
      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      const { sub, role } = await this._jwtService.verifyRtJwtToken(
        refreshToken,
      );

      const user = await this._userService.getOneById(sub);

      if (!user.token) {
        throw new ForbiddenException('Access Denied');
      }

      const tokens = await this._jwtService.createJwtToken({
        id: user.id,
        sub: user.id,
        email: user.email,
        username: user.username,
        role,
      });

      await this._userService.updateUserToken(user.id, tokens.refreshToken);

      return { ...tokens };
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }

  public async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<StatusDto> {
    try {
      const { email } = forgetPasswordDto;

      const code = generateCode();

      const user = await this._userService.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email: ${email} does not exist`);
      }

      await this._passwordRedisRepository.set({
        ...user,
        status: PasswordStatusEnum.PENDING,
        code,
      });

      this._smtpService.send(email, `Code to change password: ${code}`);
      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async resendRecoveryPassword(
    forgotPasswordDto: ForgetPasswordDto,
  ): Promise<StatusDto> {
    try {
      const { email } = forgotPasswordDto;

      const credentials = await this._passwordRedisRepository.get({ email });
      if (!credentials) {
        throw new UnprocessableEntityException(
          'You did not request change password feature',
        );
      }

      await this._passwordRedisRepository.delete({ email });

      const code = generateCode();

      await this._passwordRedisRepository.set({
        ...credentials,
        code,
        status: PasswordStatusEnum.PENDING,
      });

      this._smtpService.send(email, `Code to change password: ${code}`);

      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async validatePasswordChange(
    validatePasswordChangeDto: ValidatePasswordChangeDto,
  ): Promise<StatusDto> {
    try {
      const { email, code } = validatePasswordChangeDto;

      const credentials = await this._passwordRedisRepository.get({ email });

      if (!credentials) {
        throw new UnprocessableEntityException(
          'You did not request change password feature',
        );
      }

      if (code !== credentials.code) {
        throw new ForbiddenException('Incorrect code');
      }

      await this._passwordRedisRepository.set({
        ...credentials,
        status: PasswordStatusEnum.CONFIRMED,
      });
      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<StatusDto> {
    const { password, email } = changePasswordDto;

    try {
      const { id, status } = await this._passwordRedisRepository.get({ email });

      if (!id) {
        throw new UnprocessableEntityException(
          'You did not request change password feature',
        );
      }

      if (status === PasswordStatusEnum.PENDING) {
        throw new ForbiddenException('Your request is not valid');
      }

      const hashPassword = await this._hashingService.hashPassword(password);

      await this._userService.updateUserPassword(email, hashPassword);
      return { status: StatusEnum.DONE };
    } catch (err) {
      this.Logger.error(err);

      throw new HttpException(
        {
          status: StatusEnum.FAILED,
          errorMessage: err,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
