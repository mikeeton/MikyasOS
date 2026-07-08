import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTimeEntryDto {
  @IsUUID()
  taskId!: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsDateString()
  startTime!: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  manualEntry?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
