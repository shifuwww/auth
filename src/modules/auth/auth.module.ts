import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { HashingModule, JwtModule, SmtpModule } from 'src/shared/modules';
import {
  AccountRedisRepository,
  PasswordRedisRepository,
} from './repositories';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [UserModule, SmtpModule, HashingModule, JwtModule],
  providers: [
    AuthService,
    AccountRedisRepository,
    PasswordRedisRepository,
    RtStrategy,
    AtStrategy,
  ],
})
export class AuthModule {}
