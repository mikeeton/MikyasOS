import {
  ConnectionStatus,
  IntegrationAuthType,
  IntegrationCategory,
  IntegrationLogSeverity,
  IntegrationStatus,
  SyncMode,
  WebhookDirection,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListIntegrationsDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsEnum(IntegrationCategory)
  category?: IntegrationCategory;

  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;
}

export class CreateIntegrationDto {
  @IsString()
  @MaxLength(80)
  key!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEnum(IntegrationCategory)
  category!: IntegrationCategory;

  @IsString()
  @MaxLength(80)
  provider!: string;

  @IsOptional()
  @IsUUID()
  connectorId?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}

export class CreateConnectionDto {
  @IsUUID()
  integrationId!: string;

  @IsOptional()
  @IsUUID()
  credentialId?: string;

  @IsOptional()
  @IsEnum(ConnectionStatus)
  status?: ConnectionStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateCredentialDto {
  @IsUUID()
  integrationId!: string;

  @IsEnum(IntegrationAuthType)
  authType!: IntegrationAuthType;

  @IsString()
  @MaxLength(120)
  label!: string;

  @IsObject()
  secret!: Record<string, unknown>;
}

export class StartSyncDto {
  @IsUUID()
  integrationId!: string;

  @IsOptional()
  @IsUUID()
  connectionId?: string;

  @IsEnum(SyncMode)
  mode!: SyncMode;

  @IsString()
  @MaxLength(80)
  entity!: string;
}

export class CreateWebhookEndpointDto {
  @IsOptional()
  @IsUUID()
  integrationId?: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEnum(WebhookDirection)
  direction!: WebhookDirection;

  @IsUrl({ require_tld: false })
  url!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class ReceiveWebhookDto {
  @IsString()
  @MaxLength(120)
  event!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}

export class CreateApiKeyDto {
  @IsOptional()
  @IsUUID()
  integrationId?: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];
}

export class CreateLogDto {
  @IsOptional()
  @IsUUID()
  integrationId?: string;

  @IsOptional()
  @IsUUID()
  syncId?: string;

  @IsOptional()
  @IsEnum(IntegrationLogSeverity)
  severity?: IntegrationLogSeverity;

  @IsString()
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
