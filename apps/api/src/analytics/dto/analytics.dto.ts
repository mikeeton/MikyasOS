import {
  AnalyticsReportType,
  ChartType,
  DashboardVisibility,
  ForecastType,
  MetricType,
  WidgetType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
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

export class ListAnalyticsDto {
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

export class CreateDashboardDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(DashboardVisibility)
  visibility?: DashboardVisibility;

  @IsOptional()
  @IsObject()
  layout?: Record<string, unknown>;
}

export class CreateWidgetDto {
  @IsUUID()
  dashboardId!: string;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsEnum(WidgetType)
  type!: WidgetType;

  @IsObject()
  config!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  position?: Record<string, unknown>;
}

export class CreateMetricDto {
  @IsString()
  @MaxLength(120)
  key!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEnum(MetricType)
  type!: MetricType;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  unit?: string;
}

export class CreateKpiDto {
  @IsOptional()
  @IsUUID()
  metricId?: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  target?: number;
}

export class CreateReportDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEnum(AnalyticsReportType)
  type!: AnalyticsReportType;

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}

export class CreateForecastDto {
  @IsEnum(ForecastType)
  type!: ForecastType;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  horizonDays?: number;
}

export class CreateChartDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEnum(ChartType)
  type!: ChartType;

  @IsObject()
  config!: Record<string, unknown>;
}

export class CreateSnapshotDto {
  @IsOptional()
  @IsDateString()
  snapshotDate?: string;
}

export class CreateSavedViewDto {
  @IsOptional()
  @IsUUID()
  dashboardId?: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsObject()
  config!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  shared?: boolean;
}
