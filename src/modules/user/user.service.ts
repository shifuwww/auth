import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  private Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {
    super(_userRepository);
  }

  public getUserByEmail(email: string) {
    return this._userRepository.findOne({
      where: { email },
    });
  }

  public getUserByUsername(username: string) {
    return this._userRepository.findOne({
      where: { username },
    });
  }

  public getAllUsers() {
    return this._userRepository.find({
      select: ['id', 'email', 'role', 'username', 'createdAt', 'updatedAt'],
    });
  }

  public createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = new UserEntity();
      newUser.absorbFromDto(createUserDto);

      return this._userRepository.save(newUser);
    } catch (err) {
      this.Logger.error(err);
      throw err;
    }
  }

  public updateUserToken(id: string, token: string | null) {
    return this._userRepository.update({ id }, { token });
  }

  public updateUserPassword(email: string, password: string) {
    return this._userRepository.update({ email }, { password });
  }
}
