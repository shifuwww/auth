import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { HashingModule, JwtModule, SmtpModule } from 'src/shared/modules';
import {
  AccountRedisRepository,
  PasswordRedisRepository,
} from './repositories';

@Module({
  imports: [UserModule, SmtpModule, HashingModule, JwtModule],
  providers: [AuthService, AccountRedisRepository, PasswordRedisRepository],
})
export class AuthModule {}
