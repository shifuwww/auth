import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Redis } from '../../../interfaces/redis.interface';
import {
  PRIMARY_KEY_METADATA_KEY,
  REDIS_ENTITY_METADATA_KEY,
} from '../../../const/redis.const';
import { DecoratedRedisEntityFields } from '../decorators/redis-entity.decorator';
import { RedisEventAlias } from '../enums/redis-event-alias.enum';
import { RedisEventChannel } from '../enums/redis-event-channel.enum';

interface RepositoryOptions<T> {
  baseClass: ClassConstructor<T>;
  keyspaceNotificationOptions?: KeyspaceNotificationOptions;
}

interface KeyspaceNotificationOptions {
  expired?: KeyExpiredNotificationOptions;
  deleted?: boolean;
}

interface KeyExpiredNotificationOptions {
  passEntityToHandler?: boolean;
}

export class Repository<T extends Record<string, any>> {
  private readonly baseEntity: ClassConstructor<T>;

  private primaryKey: string;
  private readonly redisEntityMetadata: DecoratedRedisEntityFields;

  private readonly storageKeyPrefix: string;
  private readonly ttlMilliseconds: number;

  private redisEventSubscriber: Redis;
  private redisNotifyKeyspaceEventsRegisterValue = 'KE';

  constructor(
    private readonly redisClient: Redis,
    private readonly repositoryOptions: RepositoryOptions<T>,
  ) {
    this.baseEntity = this.repositoryOptions.baseClass;

    this.primaryKey = Reflect.getMetadata(
      PRIMARY_KEY_METADATA_KEY,
      this.baseEntity,
    );
    this.redisEntityMetadata = Reflect.getMetadata(
      REDIS_ENTITY_METADATA_KEY,
      this.baseEntity,
    );

    this.validateMetadata(this.redisEntityMetadata, this.primaryKey);

    this.storageKeyPrefix = this.redisEntityMetadata.get('keyPrefix') as string;
    this.ttlMilliseconds = this.redisEntityMetadata.get(
      'ttlMilliseconds',
    ) as number;

    if (repositoryOptions.keyspaceNotificationOptions) {
      this.startRedisInternalEventHandling();
    }
  }

  private startRedisInternalEventHandling(): void {
    this.redisEventSubscriber = this.redisClient.duplicate();

    if (
      this.onKeyExpired &&
      this.repositoryOptions.keyspaceNotificationOptions?.expired
    ) {
      this.redisNotifyKeyspaceEventsRegisterValue +=
        RedisEventAlias.EXPIRED_EVENT;
      this.redisEventSubscriber.subscribe(RedisEventChannel.EXPIRED);
    }

    if (
      this.onKeyDeleted &&
      this.repositoryOptions.keyspaceNotificationOptions?.deleted
    ) {
      this.redisNotifyKeyspaceEventsRegisterValue +=
        RedisEventAlias.GENERIC_COMMAND;
      this.redisEventSubscriber.subscribe(RedisEventChannel.DEL);
    }

    this.redisClient.config(
      'SET',
      'notify-keyspace-events',
      this.redisNotifyKeyspaceEventsRegisterValue,
    );
    this.setupRedisInternalEventHandler();
  }

  private doesKeyBelongToCurrentRepository(key: string) {
    return key.split(':')[0] === this.storageKeyPrefix;
  }

  private setupRedisInternalEventHandler(): void {
    const handleEvent = async (channel: string, key: string) => {
      if (
        channel === RedisEventChannel.EXPIRED &&
        this.doesKeyBelongToCurrentRepository(key)
      ) {
        this.handleKeyExpiredEvent(key);
      }

      if (
        channel === RedisEventChannel.DEL &&
        this.doesKeyBelongToCurrentRepository(key)
      ) {
        this.handleKeyDeletedEvent(key);
      }
    };

    this.redisEventSubscriber.on('message', handleEvent);
  }

  private validateMetadata(redisEntityMetadata, primaryKeyMetadata) {
    if (!redisEntityMetadata) {
      throw new Error(
        'If you want to use redis repository you should call @RedisEntity decorator',
      );
    }

    if (!primaryKeyMetadata) {
      throw new Error('Primary key not found');
    }
  }

  private async handleKeyExpiredEvent(key: string): Promise<void> {
    const options = this.repositoryOptions.keyspaceNotificationOptions?.expired;

    if (!options?.passEntityToHandler) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.onKeyExpired?.({ primaryKey: key.split(':').pop()! });

      return;
    }

    const shadowCopyKey = key.split(':').join('__');
    const stringifiedValue = await this.redisClient.get(shadowCopyKey);
    await this.redisClient.del(shadowCopyKey);

    const shadowCopy = plainToInstance(
      this.repositoryOptions.baseClass,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(stringifiedValue!),
    );

    this.onKeyExpired?.(shadowCopy);
  }

  private async handleKeyDeletedEvent(key: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.onKeyDeleted?.({ primaryKey: key.split(':').pop()! });
  }

  protected onKeyExpired?(
    entity?: T | { primaryKey: string },
  ): Promise<void> | void;
  protected onKeyDeleted?(primaryKey?: {
    primaryKey: string;
  }): Promise<void> | void;

  public async delete(entity: Partial<T>): Promise<void> {
    const key = entity[this.primaryKey];
    const keyWithPrefix = `${this.storageKeyPrefix}:${key}`;

    if (
      this.repositoryOptions.keyspaceNotificationOptions?.expired
        ?.passEntityToHandler
    ) {
      const shadowCopyKey = keyWithPrefix.split(':').join('__');

      await this.redisClient.del(shadowCopyKey);
    }

    await this.redisClient.del(keyWithPrefix);
  }

  public async get(entity: Partial<T>): Promise<T | null> {
    const key = entity[this.primaryKey];
    const stringifiedValue = await this.redisClient.get(
      `${this.storageKeyPrefix}:${key}`,
    );

    if (!stringifiedValue) {
      return null;
    }

    return plainToInstance(
      this.repositoryOptions.baseClass,
      JSON.parse(stringifiedValue),
    );
  }

  public async set(entity: T): Promise<void> {
    const key = entity[this.primaryKey];
    const keyWithPrefix = `${this.storageKeyPrefix}:${key}`;

    const stringifiedValue = JSON.stringify(entity);

    if (this.ttlMilliseconds) {
      await this.redisClient.set(
        keyWithPrefix,
        stringifiedValue,
        'PX',
        this.ttlMilliseconds,
      );

      if (
        this.repositoryOptions.keyspaceNotificationOptions?.expired
          ?.passEntityToHandler
      ) {
        const shadowCopyKey = keyWithPrefix.split(':').join('__');

        await this.redisClient.set(shadowCopyKey, stringifiedValue);
      }

      return;
    }

    await this.redisClient.set(keyWithPrefix, stringifiedValue);
  }
}
