import { Redis } from 'ioredis';

import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from '../../shared/const/redis.const';
import { RedisModuleOptions } from '../../shared/interfaces/redis.interface';

export function getRedisOptionsToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_OPTIONS_TOKEN}`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${
    connection || REDIS_MODULE_CONNECTION
  }_${REDIS_MODULE_CONNECTION_TOKEN}`;
}

export function createRedisConnection(options: RedisModuleOptions) {
  const { config } = options;

  if (config.url) {
    return new Redis(config.url, config);
  } else {
    return new Redis(config);
  }
}
