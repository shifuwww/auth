import { REDIS_ENTITY_METADATA_KEY } from '../../../const/redis.const';

interface RedisEntityDecoratorParameters {
  keyPrefix: string;
  ttlMilliseconds?: number;
}

export type DecoratedRedisEntityFields = Map<
  keyof RedisEntityDecoratorParameters,
  RedisEntityDecoratorParameters[keyof RedisEntityDecoratorParameters]
>;

export function RedisEntity(
  parameters: RedisEntityDecoratorParameters,
): ClassDecorator {
  return function (target) {
    const decoratedFields =
      Reflect.getOwnMetadata(REDIS_ENTITY_METADATA_KEY, target) || new Map();

    Object.entries(parameters).forEach(([key, value]) => {
      decoratedFields.set(key, value);
    });

    Reflect.defineMetadata(REDIS_ENTITY_METADATA_KEY, decoratedFields, target);

    return;
  };
}
