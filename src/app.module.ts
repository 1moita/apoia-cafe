import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserModule } from 'src/module/user.module';
import { APIModule } from 'src/module/api/api.module';

import { PrismaProvider } from 'src/provider/prisma.provider';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { PaymentService } from './service/payment.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME }
    }),
    UserModule,
    APIModule
  ],
  providers: [
    JwtService,
    PrismaProvider,
    AuthService,
    UserService,
    PaymentService,
  ]
})
export class AppModule {}
