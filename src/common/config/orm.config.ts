import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('PSQL_HOST'),
      port: configService.get('PSQL_PORT'),
      database: configService.get('PSQL_DATABASE'),
      username: configService.get('PSQL_USERNAME'),
      password: configService.get('PSQL_PASSWORD'),
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    };
  },
  inject: [ConfigService],
};
