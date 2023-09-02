import { UserRoleEnum } from 'src/shared/enums';
import { PrimaryKey, RedisEntity } from 'src/shared/modules/redis/decorators';

@RedisEntity({
  keyPrefix: AccountRedisEntity.name,
  ttlMilliseconds: 300000,
})
export class AccountRedisEntity {
  @PrimaryKey()
  username: string;

  email: string;
  code: string;
  password: string;
  role: UserRoleEnum;
}
