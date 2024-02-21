import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaProvider } from 'src/provider/prisma.provider';

import { UserService } from './user.service';

const mp = require('mercadopago');
mp.configurations.setAccessToken(process.env.MERCADOPAGO_SDK_ACCESS_TOKEN);

export interface Payment {
  id: number;
  created_at: Date | number;
  status: string;
  transaction_amount: number;
  payer: string;
  to: string;
  message: string;
  payment_code: string;
  base64_payment_code: string;
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly user: UserService
  ) {}

  async createPayment(transaction_amount: number, payer: string, to: string, message: string) {
    const user = await this.user.getUserById(payer);
    if(!user) throw new BadRequestException('There is no user defined as payer');

    let mp_payment = await mp.payment.create({
      transaction_amount,
      installments: 1,
      notification_url: 'https://moitaa.osmior.xyz/api/ipn',
      payment_method_id: 'pix',
      payer: { email: user.email },
      external_reference: to
    });
    if(!mp_payment || !mp_payment.response) throw new InternalServerErrorException('Couldn\'t create MercadoPago payment');

    const payment = await this.prisma.payment.create({
      data: { 
        id: mp_payment.response.id, 
        status: mp_payment.response.status, 
        transaction_amount, 
        payer, 
        to,
        message,
        payment_code: mp_payment.response.point_of_interaction.transaction_data.qr_code, 
        base64_payment_code: mp_payment.response.point_of_interaction.transaction_data.qr_code_base64
      }
    });
    if(!payment) throw new InternalServerErrorException('Couldn\'t create payment');

    return payment;
  }

  async updatePayment(id: number, data: any) {
    const _ = await this.getPaymentById(id);

    const payment = await this.prisma.payment.update({
      where: { id: _.id },
      data
    });

    if(!payment) throw new InternalServerErrorException('Couldn\'t update payment');
    return payment;
  }

  async getPaymentById(id: number) {
    let payment = await this.prisma.payment.findUnique({ where: { id } });
    if(payment !== null) {
      return payment;
    } else throw new InternalServerErrorException('There is no payment with that id');
  }

  async getMercadoPagoPaymentById(id: number) {
    const payment = await mp.payment.get(id);
    if(payment !== null) {
      return payment;
    } else throw new InternalServerErrorException('There is no MercadoPago payment with that id');
  }
}