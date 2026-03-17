import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Ship the NestJS Todo API' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ example: 'Finish auth flow and migrations.', nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value === null ? null : value))
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(2000)
  description?: string | null;
}
