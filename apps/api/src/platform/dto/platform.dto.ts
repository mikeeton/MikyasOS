import {
  BackupStatus,
  CircuitBreakerState,
  DeploymentStatus,
  FeatureFlagScope,
  IncidentSeverity,
  IncidentStatus,
  PlatformStatus,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListPlatformDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 25;
}

export class CreateIncidentDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;

  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class CreateFeatureFlagDto {
  @IsString()
  @MaxLength(100)
  key!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsEnum(FeatureFlagScope)
  scope?: FeatureFlagScope;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  rolloutPercent?: number;
}

export class CreateBackupDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(120)
  target!: string;

  @IsOptional()
  @IsEnum(BackupStatus)
  status?: BackupStatus;
}

export class CreateDeploymentDto {
  @IsString()
  @MaxLength(80)
  version!: string;

  @IsString()
  @MaxLength(80)
  environment!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  commitSha?: string;

  @IsOptional()
  @IsEnum(DeploymentStatus)
  status?: DeploymentStatus;
}

export class SetCircuitBreakerDto {
  @IsString()
  @MaxLength(120)
  service!: string;

  @IsEnum(CircuitBreakerState)
  state!: CircuitBreakerState;
}

export class RecordHealthDto {
  @IsString()
  @MaxLength(120)
  service!: string;

  @IsEnum(PlatformStatus)
  status!: PlatformStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  responseTimeMs?: number;
}

export class RecordCostDto {
  @IsString()
  @MaxLength(80)
  category!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  provider?: string;
}

export class RecoveryActionDto {
  @IsString()
  @MaxLength(160)
  action!: string;

  @IsString()
  @MaxLength(1000)
  reason!: string;

  @IsOptional()
  @IsObject()
  verification?: Record<string, unknown>;
}
