import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig, redisConfig } from './common/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule, RedisModule, SmtpModule } from './shared/modules';
import SMTP_CONFIG from 'src/common/config/smtp.config';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    RedisModule.forRootAsync(redisConfig),
    SmtpModule.forRootAsync(SMTP_CONFIG.asProvider()),
    AdminModule,
    JwtModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
