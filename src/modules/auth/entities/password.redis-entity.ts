import { PasswordStatus } from 'src/shared/enums';
import { PrimaryKey, RedisEntity } from 'src/shared/modules/redis/decorators';

@RedisEntity({
  keyPrefix: PasswordRedisEntity.name,
  ttlMilliseconds: 300000,
})
export class PasswordRedisEntity {
  @PrimaryKey()
  email: string;

  id: string;
  username: string;
  code: string;
  status: PasswordStatus;
}
