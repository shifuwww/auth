import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ActivateRegisterDto, RegisterDto } from './dtos';
import { generateCode } from 'src/common/utils';
import { HashingService, JwtService, SmtpService } from 'src/shared/modules';
import { AccountRedisRepository } from './repositories';
import { AccountRedisEntity } from './entities';
import { CreateUserDto } from '../user/dtos';

@Injectable()
export class AuthService {
  private Logger = new Logger(AuthService.name);

  constructor(
    private readonly _accountRedisRepository: AccountRedisRepository,
    private readonly _hashingService: HashingService,
    private readonly _userService: UserService,
    private readonly _smtpService: SmtpService,
    private readonly _jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto) {
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

      const account: AccountRedisEntity = {
        ...registerDto,
        code,
      };

      await this._accountRedisRepository.set(account);

      this._smtpService.send(registerDto.email, code);

      return { code };
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }

  public async activateAccount(activateRegisterDto: ActivateRegisterDto) {
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

      return { ...tokens };
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }
}
