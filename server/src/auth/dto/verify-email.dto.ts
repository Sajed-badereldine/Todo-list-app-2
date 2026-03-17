import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'verification-token-from-email' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  token: string;
}
