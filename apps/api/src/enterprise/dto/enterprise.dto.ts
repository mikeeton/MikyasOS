import {
  AuditSeverity,
  ComplianceFramework,
  ComplianceStatus,
  DirectoryProviderType,
  EnterprisePolicyType,
  LicenseStatus,
  PolicyStatus,
  SSOProviderType,
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
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListEnterpriseDto {
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
}

export class CreateBusinessUnitDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class CreateHierarchyDto {
  @IsUUID()
  parentOrganisationId!: string;

  @IsUUID()
  childOrganisationId!: string;

  @IsOptional()
  @IsBoolean()
  inheritedPermissions?: boolean;

  @IsOptional()
  @IsBoolean()
  delegatedAdmin?: boolean;
}

export class CreateCustomRoleDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentRoleId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsBoolean()
  delegatedAdmin?: boolean;
}

export class CreatePermissionGroupDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}

export class CreateEnterprisePolicyDto {
  @IsEnum(EnterprisePolicyType)
  type!: EnterprisePolicyType;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @IsObject()
  rules!: Record<string, unknown>;
}

export class CreateAuditEventDto {
  @IsOptional()
  @IsEnum(AuditSeverity)
  severity?: AuditSeverity;

  @IsString()
  @MaxLength(160)
  action!: string;

  @IsString()
  @MaxLength(80)
  module!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateSsoProviderDto {
  @IsEnum(SSOProviderType)
  type!: SSOProviderType;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains?: string[];
}

export class CreateDirectoryConnectionDto {
  @IsEnum(DirectoryProviderType)
  type!: DirectoryProviderType;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsBoolean()
  provisioning?: boolean;

  @IsOptional()
  @IsBoolean()
  deprovisioning?: boolean;
}

export class CreateComplianceRecordDto {
  @IsEnum(ComplianceFramework)
  framework!: ComplianceFramework;

  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @IsString()
  @MaxLength(160)
  control!: string;
}

export class CreateLicenseDto {
  @IsString()
  @MaxLength(80)
  plan!: string;

  @IsOptional()
  @IsEnum(LicenseStatus)
  status?: LicenseStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats?: number;
}
