import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginPayload {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, minLength: 8 })
  password: string;
}

export class RegisterPayload {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
  
  @ApiProperty({ required: true, minLength: 8, maxLength: 24 })
  password: string;
  
  @ApiProperty({ required: true, minLength: 2, maxLength: 12 })
  identifier: string;
}