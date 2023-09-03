import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from '../../../../common/utils/redis.utils';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};
