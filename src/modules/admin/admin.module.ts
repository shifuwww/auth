import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  imports: [UserModule],
  providers: [AdminService],
})
export class AdminModule {}
