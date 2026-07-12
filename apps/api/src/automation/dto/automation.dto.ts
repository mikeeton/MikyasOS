import {
  WorkflowActionType,
  WorkflowApprovalStatus,
  WorkflowConditionOperator,
  WorkflowScheduleType,
  WorkflowStatus,
  WorkflowTriggerType,
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
  ValidateNested,
} from 'class-validator';

export class ListAutomationDto {
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

export class IdParamDto {
  @IsUUID()
  id!: string;
}

export class WorkflowConditionDto {
  @IsEnum(WorkflowConditionOperator)
  operator!: WorkflowConditionOperator;

  @IsString()
  @MaxLength(120)
  field!: string;

  @IsOptional()
  value?: unknown;
}

export class WorkflowActionDto {
  @IsEnum(WorkflowActionType)
  type!: WorkflowActionType;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}

export class CreateWorkflowDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsEnum(WorkflowTriggerType)
  triggerType!: WorkflowTriggerType;

  @IsOptional()
  @IsObject()
  triggerConfig?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowConditionDto)
  conditions?: WorkflowConditionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowActionDto)
  actions?: WorkflowActionDto[];
}

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class ExecuteWorkflowDto {
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}

export class CreateScheduleDto {
  @IsUUID()
  workflowId!: string;

  @IsEnum(WorkflowScheduleType)
  type!: WorkflowScheduleType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  cronExpression?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  timezone?: string;
}

export class CreateVariableDto {
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @IsString()
  @MaxLength(120)
  key!: string;

  @IsOptional()
  value?: unknown;

  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}

export class CreateApprovalDto {
  @IsUUID()
  workflowId!: string;

  @IsOptional()
  @IsUUID()
  executionId?: string;

  @IsString()
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}

export class DecideApprovalDto {
  @IsEnum(WorkflowApprovalStatus)
  status!: WorkflowApprovalStatus;
}
