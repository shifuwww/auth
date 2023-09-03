import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModuleAsyncOptions } from 'src/shared/interfaces';

export const redisConfig: RedisModuleAsyncOptions = {
  imports: [ConfigModule.forRoot()],
  useFactory: (configService: ConfigService) => {
    return {
      config: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    };
  },
  inject: [ConfigService],
};
