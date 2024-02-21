import { Controller, Get, Post, Param, HttpStatus, UseGuards, Body, Res, UseFilters, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import { PaymentService } from 'src/service/payment.service';
import { User, UserService } from 'src/service/user.service';

import { AuthGuard } from 'src/guard/auth.guard';

import { CurrentUser } from 'src/decorator/current-user.decorator';

import { CreatePaymentPayload } from 'src/payload/payment.payload';
import { HttpExceptionFilter } from 'src/filter/exception.filter';

@Controller('/api/payment')
export class PaymentController {
  constructor(
    private readonly payment: PaymentService,
    private readonly user: UserService
  ) {}

  @UseFilters(HttpExceptionFilter)
  @Get('/:id')
  async getPaymentById(@Param() params: any, @Res() response: Response) {
    if(!params || !params.id) throw new BadRequestException('Bad request');
    const payment = await this.payment.getPaymentById(params.id);

    return response
      .status(HttpStatus.OK)
      .json({ 
        status_code: HttpStatus.OK, 
        message: JSON.parse(
          JSON.stringify(payment, (_, value) =>
            typeof value === 'bigint'
              ? value.toString()
              : value)
        )
      });
  }

  @UseGuards(AuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Post('/create')
  async createPayment(@CurrentUser() user, @Body() payload: CreatePaymentPayload, @Res() response: Response) {
    const payer = await this.user.getUserByIdentifier(user.user_id);
    const payment = await this.payment.createPayment(payload.transaction_amount, payer.id, payload.to, payload.message);

    return response
      .status(HttpStatus.CREATED)
      .json({
        status_code: HttpStatus.CREATED,
        message: JSON.parse(
          JSON.stringify(payment, (_, value) =>
            typeof value === 'bigint'
              ? value.toString()
              : value)
        )
      });
  }
}