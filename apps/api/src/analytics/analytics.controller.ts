import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import {
  BusinessHealthService,
  ExecutiveBriefingService,
  ForecastService,
  RecommendationService,
  RiskAnalysisService,
  TrendDetectionService,
} from './analytics-ai.service';
import { AnalyticsService } from './analytics.service';
import {
  CreateChartDto,
  CreateDashboardDto,
  CreateForecastDto,
  CreateKpiDto,
  CreateMetricDto,
  CreateReportDto,
  CreateSavedViewDto,
  CreateSnapshotDto,
  CreateWidgetDto,
  ListAnalyticsDto,
  TrackProductEventDto,
} from './dto/analytics.dto';

@Controller({ path: 'analytics', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly briefing: ExecutiveBriefingService,
    private readonly health: BusinessHealthService,
    private readonly forecast: ForecastService,
    private readonly risk: RiskAnalysisService,
    private readonly recommendation: RecommendationService,
    private readonly trends: TrendDetectionService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Analytics.Read')
  capabilities() {
    return {
      ...this.analytics.capabilities(),
      aiPreparation: {
        briefing: this.briefing.getArchitecture(),
        health: this.health.getArchitecture(),
        forecast: this.forecast.getArchitecture(),
        risk: this.risk.getArchitecture(),
        recommendation: this.recommendation.getArchitecture(),
        trends: this.trends.getArchitecture(),
      },
    };
  }

  @Get('executive')
  @RequirePermissions('Analytics.Read')
  executive(@CurrentOrganisation() organisationId: string) {
    return this.analytics.executiveDashboard(organisationId);
  }

  @Post('events')
  @RequirePermissions('Analytics.Read')
  trackEvent(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TrackProductEventDto,
  ) {
    return this.analytics.trackProductEvent(organisationId, user.id, dto);
  }

  @Get('dashboards')
  @RequirePermissions('Analytics.Read')
  dashboards(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('dashboard', organisationId, query);
  }

  @Post('dashboards')
  @RequirePermissions('Analytics.Write')
  createDashboard(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDashboardDto,
  ) {
    return this.analytics.createDashboard(organisationId, user.id, dto);
  }

  @Post('widgets')
  @RequirePermissions('Analytics.Write')
  createWidget(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWidgetDto,
  ) {
    return this.analytics.createWidget(organisationId, user.id, dto);
  }

  @Get('metrics')
  @RequirePermissions('Analytics.Read')
  metrics(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('metric', organisationId, query);
  }

  @Post('metrics')
  @RequirePermissions('Analytics.Write')
  createMetric(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMetricDto,
  ) {
    return this.analytics.createMetric(organisationId, user.id, dto);
  }

  @Get('kpis')
  @RequirePermissions('Analytics.Read')
  kpis(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('kPI', organisationId, query);
  }

  @Post('kpis')
  @RequirePermissions('Analytics.Write')
  createKpi(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateKpiDto,
  ) {
    return this.analytics.createKpi(organisationId, user.id, dto);
  }

  @Get('reports')
  @RequirePermissions('Analytics.Read')
  reports(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('report', organisationId, query);
  }

  @Post('reports')
  @RequirePermissions('Analytics.Write')
  createReport(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReportDto,
  ) {
    return this.analytics.createReport(organisationId, user.id, dto);
  }

  @Get('forecasts')
  @RequirePermissions('Analytics.Read')
  forecasts(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('forecast', organisationId, query);
  }

  @Post('forecasts')
  @RequirePermissions('Analytics.Write')
  createForecast(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateForecastDto,
  ) {
    return this.analytics.createForecast(organisationId, user.id, dto);
  }

  @Get('snapshots')
  @RequirePermissions('Analytics.Read')
  snapshots(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('businessSnapshot', organisationId, query);
  }

  @Post('snapshots')
  @RequirePermissions('Analytics.Write')
  createSnapshot(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSnapshotDto,
  ) {
    return this.analytics.createSnapshot(organisationId, user.id, dto);
  }

  @Get('charts')
  @RequirePermissions('Analytics.Read')
  charts(@CurrentOrganisation() organisationId: string, @Query() query: ListAnalyticsDto) {
    return this.analytics.list('chartConfiguration', organisationId, query);
  }

  @Post('charts')
  @RequirePermissions('Analytics.Write')
  createChart(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateChartDto,
  ) {
    return this.analytics.createChart(organisationId, user.id, dto);
  }

  @Post('saved-views')
  @RequirePermissions('Analytics.Write')
  createSavedView(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSavedViewDto,
  ) {
    return this.analytics.createSavedView(organisationId, user.id, dto);
  }
}
