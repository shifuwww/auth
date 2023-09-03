import { Injectable } from '@nestjs/common';
import { Repository } from 'src/shared/modules/redis/infrastructure/redis.repository';
import { AccountRedisEntity } from '../entities';
import { InjectRedis } from 'src/shared/modules/redis/decorators';
import { Redis } from 'src/shared/interfaces';

@Injectable()
export class AccountRedisRepository extends Repository<AccountRedisEntity> {
  constructor(@InjectRedis() private readonly redis: Redis) {
    super(redis, {
      baseClass: AccountRedisEntity,
    });
  }
}
