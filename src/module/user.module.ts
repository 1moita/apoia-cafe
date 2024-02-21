import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaProvider } from 'src/provider/prisma.provider';
import { UserService } from 'src/service/user.service';
import { AuthService } from 'src/service/auth.service';

@Module({
  imports: [],
  providers: [
    JwtService,
    PrismaProvider,
    AuthService,
    UserService
  ]
})
export class UserModule {}