import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaProvider } from 'src/provider/prisma.provider';

import { CreateWithdrawalRequestPayload } from 'src/payload/user.payload';

export interface WithdrawalRequests {
  id: string;
  created_at: Date | number;
  status: 'pending' | 'cancelled' | 'approved';
  value: number;
  from: User;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  identifier: string;
  wallet: number;
  withdrawal_requests?: WithdrawalRequests[];
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaProvider
  ) {}

  async createUser(email: string, password: string, identifier: string) {
    let user = await this.prisma.user.create({
      data: { email, password, identifier }
    });

    if(user !== null) {
      return user;
    } else throw new InternalServerErrorException('Couldn\'t register user');
  }

  async makeWithdrawalRequest(id: string, payload: CreateWithdrawalRequestPayload) {
    let user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, wallet: true, withdrawal_requests: true }
    });
    if(!user) throw new InternalServerErrorException('User not found')

    let amount = payload.value;
    user.withdrawal_requests.map(({ value }) => amount += value);
    if(user.wallet < amount) throw new UnauthorizedException('Couldn\'t request an amount higher than your wallet');

    let request = await this.prisma.withdrawalRequest.create({
      data: {
        status: 'pending',
        value: payload.value,
        user_id: user.id
      }
    });
    if(!request) throw new InternalServerErrorException('Couldn\'t create withdrawal request');

    return request;
  }

  async incrementWallet(id: string, amount: number) {
    const user = await this.getUserById(id);
    return await this.prisma.user.update({
      where: { id: user.id, email: user.email },
      data: { wallet: user.wallet + amount }
    });
  }

  async getUserByIdentifier(identifier: string) {
    let user = await this.prisma.user.findFirst({ where: { identifier } });
    if(user !== null) {
      return user;
    } else throw new NotFoundException('There is no user with that identifier');
  }

  async getUserByEmail(email: string) {
    let user = await this.prisma.user.findFirst({ where: { email } });
    if(user !== null) {
      return user;
    } else throw new NotFoundException('There is no user with that email');
  }

  async getUserById(id: string) {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if(user !== null) {
      return user;
    } else throw new NotFoundException('There is no user with that id');
  }
}