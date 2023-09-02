import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/common/base';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  private Logger = new Logger(UserService.name);

  constructor(private readonly _userRepository: Repository<UserEntity>) {
    super(_userRepository);
  }

  public getUserByEmail(email: string) {
    return this._userRepository.findOne({
      where: { email },
    });
  }
}
