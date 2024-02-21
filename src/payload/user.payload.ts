import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateWithdrawalRequestPayload {
  @ApiProperty({ required: true })
  @Min(15)
  @IsNumber({ 
    maxDecimalPlaces: 2, 
    allowInfinity: false, 
    allowNaN: false,
    })
  value: number;
}