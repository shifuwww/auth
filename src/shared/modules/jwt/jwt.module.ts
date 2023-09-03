import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from 'src/common/config/jwt.config';
import { JwtService } from './jwt.service';

@Module({
  imports: [ConfigModule.forRoot(), NestJwtModule.registerAsync(jwtConfig)],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
