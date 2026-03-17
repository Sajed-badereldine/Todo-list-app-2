import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Review the implementation' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ example: 'Confirm ownership checks are enforced.', nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value === null ? null : value))
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
