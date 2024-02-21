import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
  
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);
    if(!token) throw new UnauthorizedException('Invalid authorization header');

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Couldn\'t verify jwt');
    }

    return true;
  }
  
  private extractToken(request: Request): string | undefined { 
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}