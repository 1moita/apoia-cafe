import { Controller, Post, Body, HttpStatus, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';

import { PaymentService } from 'src/service/payment.service';
import { UserService } from 'src/service/user.service';

import { HttpExceptionFilter } from 'src/filter/exception.filter';

@Controller('/api/ipn')
export class IPNController {
  constructor(
    private readonly payment: PaymentService,
    private readonly user: UserService
  ) {}

  @UseFilters(HttpExceptionFilter)
  @Post('/')
  async handleIPNAlert(@Body() body: any, @Res() response: Response) {
    if(body?.action == 'payment.updated' || body?.action == 'payment.created') {
      const info = await this.payment.getMercadoPagoPaymentById(body.data.id);
      const payment = await this.payment.getPaymentById(body.data.id);

      if(payment.status !== 'approved' && info.body.status === 'approved') {
        await this.user.incrementWallet(info.body.external_reference, info.body.transaction_amount);
      }

      await this.payment.updatePayment(payment.id as unknown as number, { status: info.body.status });
      return response
        .status(HttpStatus.ACCEPTED)
        .json({ status_code: HttpStatus.ACCEPTED, message: '_ipn' });
    }
  }
}