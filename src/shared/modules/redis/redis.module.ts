import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisModuleAsyncOptions,
  RedisModuleOptionsFactory,
} from '../../interfaces/redis.interface';
import {
  getRedisOptionsToken,
  getRedisConnectionToken,
  createRedisConnection,
} from '../../../common/utils/redis.utils';

@Global()
@Module({})
export class RedisModule {
  public static forRoot(
    options: RedisModuleOptions,
    connection?: string,
  ): DynamicModule {
    const redisOptionsProvider: Provider = {
      provide: getRedisOptionsToken(connection),
      useValue: options,
    };

    const redisConnectionProvider: Provider = {
      provide: getRedisConnectionToken(connection),
      useValue: createRedisConnection(options),
    };

    return {
      module: RedisModule,
      exports: [redisOptionsProvider, redisConnectionProvider],
      providers: [redisOptionsProvider, redisConnectionProvider],
    };
  }

  public static forRootAsync(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    const redisConnectionProvider: Provider = {
      inject: [getRedisOptionsToken(connection)],
      provide: getRedisConnectionToken(connection),
      useFactory(options: RedisModuleOptions) {
        return createRedisConnection(options);
      },
    };

    return {
      exports: [redisConnectionProvider],
      imports: options.imports,
      module: RedisModule,
      providers: [
        ...this.createAsyncProviders(options, connection),
        redisConnectionProvider,
      ],
    };
  }

  public static createAsyncProviders(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): Provider[] {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options, connection)];
    }

    return [
      this.createAsyncOptionsProvider(options, connection),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  public static createAsyncOptionsProvider(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): Provider {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: getRedisOptionsToken(connection),
        useFactory: options.useFactory,
      };
    }

    return {
      inject: [options.useClass || options.useExisting],
      provide: getRedisOptionsToken(connection),
      async useFactory(
        optionsFactory: RedisModuleOptionsFactory,
      ): Promise<RedisModuleOptions> {
        return optionsFactory.createRedisModuleOptions();
      },
    };
  }
}
