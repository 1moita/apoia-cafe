import { Injectable, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/service/user.service';

import { LoginPayload, RegisterPayload } from 'src/payload/auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private jwt: JwtService
  ) {}

  async loginWithPayload(payload: LoginPayload) {
    const user = await this.user.getUserByEmail(payload.email);
    console.log(user, payload, payload.email, payload.password);
    if(user?.password !== payload.password) throw new UnauthorizedException('Invalid password');

    return { 
      access_token: await this.jwt.signAsync({ id: user.id }), 
      id: user.id,
      user_id: user.identifier, 
      email: user.email 
    };
  }

  async registerUserWithPayload(payload: RegisterPayload) {
    const user = await this.user.createUser(payload.email, payload.password, payload.identifier);
    if(!user) throw new InternalServerErrorException('Couldn\'t register user (unrecognized user)');
    
    return {
      access_token: await this.jwt.signAsync({ id: user.id }),
      user_id: user.identifier,
      email: user.email
    };
  }
}