import { Injectable } from '@nestjs/common';
import { Repository } from 'src/shared/modules/redis/infrastructure/redis.repository';
import { PasswordRedisEntity } from '../entities';
import { InjectRedis } from 'src/shared/modules/redis/decorators';
import { Redis } from 'src/shared/interfaces';

@Injectable()
export class PasswordRedisRepository extends Repository<PasswordRedisEntity> {
  constructor(@InjectRedis() private readonly redis: Redis) {
    super(redis, {
      baseClass: PasswordRedisEntity,
    });
  }
}
