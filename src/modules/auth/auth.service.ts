import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/auth.dto';
import { generateCode } from 'src/common/utils';

@Injectable()
export class AuthService {
  private Logger = new Logger(AuthService.name);

  constructor(private readonly _userService: UserService) {}

  public async register(registerDto: RegisterDto) {
    try {
      const { email } = registerDto;

      const user = await this._userService.getUserByEmail(email);

      if (user) {
        throw new ConflictException({
          message: 'CONFLICT_ERROR',
          description: 'User already exists',
        });
      }

      const code = generateCode();
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }
}
