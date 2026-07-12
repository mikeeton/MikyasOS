import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import {
  BusinessHealthService,
  ExecutiveBriefingService,
  ForecastService,
  RecommendationService,
  RiskAnalysisService,
  TrendDetectionService,
} from './analytics-ai.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule],
  controllers: [AnalyticsController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    AnalyticsService,
    ExecutiveBriefingService,
    BusinessHealthService,
    ForecastService,
    RiskAnalysisService,
    RecommendationService,
    TrendDetectionService,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

export class DashboardsModule {}
export class MetricsModule {}
export class ReportsModule {}
export class ForecastingModule {}
export class ChartsModule {}
export class DataAggregationModule {}
export class SnapshotModule {}
export class InsightsModule {}
