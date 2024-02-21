import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PrismaProvider } from 'src/provider/prisma.provider';
import { PaymentService } from 'src/service/payment.service';
import { AuthService } from 'src/service/auth.service';
import { UserService } from 'src/service/user.service';

import { AuthController } from 'src/controller/api/auth.controller';
import { APIUserController } from 'src/controller/api/user.controller';
import { IPNController } from 'src/controller/api/ipn.controller';
import { PaymentController } from 'src/controller/api/payment.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AuthController,
    APIUserController,
    PaymentController,
    IPNController
  ],
  providers: [
    PrismaProvider,
    PaymentService,
    AuthService,
    UserService,
  ],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })]
})
export class APIModule {}