import { Controller, Post, Body, HttpStatus, UseFilters, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/service/auth.service';

import { LoginPayload, RegisterPayload } from 'src/payload/auth.payload';

import { HttpExceptionFilter } from 'src/filter/exception.filter';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService
  ) {}

  @Post('/login')
  @UseFilters(HttpExceptionFilter)
  async login(@Body() payload: LoginPayload, @Res() response: Response) {
    const auth = await this.auth.loginWithPayload(payload);
    return response
      .status(HttpStatus.OK)
      .json({ status_code: HttpStatus.OK, message: auth });
  }

  @Post('/register')
  @UseFilters(HttpExceptionFilter)
  async register(@Body() payload: RegisterPayload, @Res() response: Response) {
    const auth = await this.auth.registerUserWithPayload(payload);
    return response
      .status(HttpStatus.CREATED)
      .json({ status_code: HttpStatus.CREATED, message: auth });
  }
}