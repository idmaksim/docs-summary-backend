import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [UsersModule, TokenModule, PasswordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
