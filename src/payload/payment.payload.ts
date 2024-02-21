import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePaymentPayload {
  @ApiProperty({ required: true })
  @IsNumber({ 
    maxDecimalPlaces: 2, 
    allowInfinity: false, 
    allowNaN: false
  })
  transaction_amount: number;

  @ApiProperty({ 
    required: false, 
    minLength: 1,
    maxLength: 200
  })
  message: string;

  @ApiProperty({ required: true })
  to: string;
}