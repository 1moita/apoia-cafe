import { Controller, Get, Post, Body, Res, UseGuards, UseFilters, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { User, UserService } from 'src/service/user.service';

import { CurrentUser } from 'src/decorator/current-user.decorator';

import { AuthGuard } from 'src/guard/auth.guard';

import { CreateWithdrawalRequestPayload } from 'src/payload/user.payload';

import { HttpExceptionFilter } from 'src/filter/exception.filter';

@Controller('/api/user')
export class APIUserController {
  constructor( 
    private readonly user: UserService
  ) {}

  @UseGuards(AuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Get('/me')
  async getCurrentUser(@CurrentUser() user: User, @Res() response: Response) {
    const collect = await this.user.getUserById(user.id);
    return response
      .status(HttpStatus.OK)
      .json({
        status_code: HttpStatus.OK,
        message: {
          id: collect.id,
          email: collect.email,
          user_id: collect.identifier,
          wallet: collect.wallet
        }
      });
  }

  @UseGuards(AuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Post('/withdraw/request')
  async createWithdrawalRequest(@CurrentUser() user: User, @Res() response: Response, @Body() payload: CreateWithdrawalRequestPayload) {
    const request = await this.user.makeWithdrawalRequest(user.id, payload);
    return response
      .status(HttpStatus.CREATED)
      .json({
        status_code: HttpStatus.CREATED,
        message: request
      });
  }
}