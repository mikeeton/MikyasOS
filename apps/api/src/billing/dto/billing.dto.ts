import {
  BillingInterval,
  BillingProvider,
  CheckoutStatus,
  DataFormat,
  ExportStatus,
  ImportStatus,
  OnboardingStatus,
  PlanTier,
  SaasSubscriptionStatus,
  UsageMetric,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListBillingDto {
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

export class CreatePlanDto {
  @IsEnum(PlanTier)
  tier!: PlanTier;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUsers!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  storageGb!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  aiTokensMonthly!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  automationsMonthly!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  projectsLimit!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  documentsLimit!: number;

  @IsBoolean()
  apiAccess!: boolean;

  @IsString()
  @MaxLength(80)
  supportLevel!: string;

  @IsOptional()
  @IsBoolean()
  enterpriseFeatures?: boolean;
}

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsEnum(BillingProvider)
  provider?: BillingProvider;

  @IsOptional()
  @IsEnum(SaasSubscriptionStatus)
  status?: SaasSubscriptionStatus;

  @IsOptional()
  @IsEnum(BillingInterval)
  interval?: BillingInterval;
}

export class CreateCheckoutDto {
  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsEnum(BillingProvider)
  provider?: BillingProvider;

  @IsOptional()
  @IsEnum(BillingInterval)
  interval?: BillingInterval;

  @IsOptional()
  @IsString()
  successUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class UpdateCheckoutStatusDto {
  @IsEnum(CheckoutStatus)
  status!: CheckoutStatus;
}

export class RecordUsageDto {
  @IsEnum(UsageMetric)
  metric!: UsageMetric;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateOnboardingDto {
  @IsOptional()
  @IsEnum(OnboardingStatus)
  status?: OnboardingStatus;

  @IsOptional()
  @IsString()
  currentStep?: string;

  @IsOptional()
  @IsObject()
  checklist?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  sampleWorkspace?: boolean;

  @IsOptional()
  @IsBoolean()
  aiIntroduced?: boolean;
}

export class CreateDataImportDto {
  @IsString()
  @MaxLength(80)
  type!: string;

  @IsEnum(DataFormat)
  format!: DataFormat;

  @IsOptional()
  @IsEnum(ImportStatus)
  status?: ImportStatus;

  @IsOptional()
  @IsString()
  filename?: string;
}

export class CreateDataExportDto {
  @IsString()
  @MaxLength(80)
  type!: string;

  @IsEnum(DataFormat)
  format!: DataFormat;

  @IsOptional()
  @IsEnum(ExportStatus)
  status?: ExportStatus;
}
