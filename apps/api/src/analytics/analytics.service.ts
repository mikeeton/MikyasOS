import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AnalyticsEventType,
  AnalyticsReportType,
  CashFlowDirection,
  ChartType,
  ForecastType,
  MetricType,
  Prisma,
} from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
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
} from './dto/analytics.dto';

type AnalyticsDelegate =
  | 'dashboard'
  | 'metric'
  | 'kPI'
  | 'report'
  | 'forecast'
  | 'businessSnapshot'
  | 'chartConfiguration'
  | 'analyticsEvent'
  | 'analyticsFilter'
  | 'savedView'
  | 'dataSource';

type AnalyticsModelDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
  findFirst(args: unknown): Promise<{ id: string } | null>;
};

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  capabilities() {
    return {
      modules: [
        'AnalyticsModule',
        'DashboardsModule',
        'MetricsModule',
        'ReportsModule',
        'ForecastingModule',
        'ChartsModule',
        'DataAggregationModule',
        'SnapshotModule',
        'InsightsModule',
      ],
      metrics: Object.values(MetricType),
      reports: Object.values(AnalyticsReportType),
      charts: Object.values(ChartType),
      forecasting: Object.values(ForecastType),
    };
  }

  async executiveDashboard(organisationId: string) {
    const [
      invoiceAggregate,
      expenseAggregate,
      cashInAggregate,
      cashOutAggregate,
      customers,
      leads,
      projects,
      riskyProjects,
      tasks,
      documents,
      workflows,
      meetings,
    ] = await this.prisma.$transaction([
      this.prisma.invoice.aggregate({
        where: { organisationId, deletedAt: null },
        _sum: { total: true, balance: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { organisationId, deletedAt: null },
        _sum: { total: true },
        _count: true,
      }),
      this.prisma.cashFlowEntry.aggregate({
        where: { organisationId, deletedAt: null, direction: CashFlowDirection.INFLOW },
        _sum: { amount: true },
      }),
      this.prisma.cashFlowEntry.aggregate({
        where: { organisationId, deletedAt: null, direction: CashFlowDirection.OUTFLOW },
        _sum: { amount: true },
      }),
      this.prisma.company.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.lead.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.project.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.project.count({
        where: {
          organisationId,
          deletedAt: null,
          OR: [{ status: 'ON_HOLD' }, { priority: 'URGENT' }],
        },
      }),
      this.prisma.task.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.document.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.workflow.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.meeting.count({ where: { organisationId, deletedAt: null } }),
    ]);
    const revenue = Number(invoiceAggregate._sum.total ?? 0);
    const expenses = Number(expenseAggregate._sum.total ?? 0);
    const cashFlow =
      Number(cashInAggregate._sum.amount ?? 0) - Number(cashOutAggregate._sum.amount ?? 0);
    const profit = revenue - expenses;
    const healthScore = this.healthScore({
      revenue,
      profit,
      cashFlow,
      riskyProjects,
      outstanding: Number(invoiceAggregate._sum.balance ?? 0),
    });
    return {
      companyHealthScore: healthScore,
      revenue,
      expenses,
      profit,
      cashFlow,
      salesPipeline: { leads, customers },
      projectsAtRisk: riskyProjects,
      employeeCapacity: { status: 'prepared', tasks },
      outstandingInvoices: Number(invoiceAggregate._sum.balance ?? 0),
      customerSatisfaction: { status: 'placeholder', score: null },
      activity: { projects, tasks, documents, workflows, meetings },
      aiExecutiveBriefing: {
        status: 'prepared',
        note: 'Executive briefing architecture is ready without LLM generation.',
      },
    };
  }

  async list(delegate: AnalyticsDelegate, organisationId: string, query: ListAnalyticsDto) {
    const model = this.delegate(delegate);
    const where = this.where(organisationId, query);
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      model.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount: Math.ceil(total / query.pageSize),
        hasNextPage: query.page * query.pageSize < total,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async createDashboard(organisationId: string, actorUserId: string, dto: CreateDashboardDto) {
    const dashboard = await this.prisma.dashboard.create({
      data: {
        organisationId,
        createdById: actorUserId,
        name: dto.name,
        description: dto.description,
        visibility: dto.visibility,
        layout: (dto.layout ?? {}) as Prisma.InputJsonValue,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.DASHBOARD_VIEWED,
      'dashboard',
      dashboard.id,
    );
    return dashboard;
  }

  async createWidget(organisationId: string, actorUserId: string, dto: CreateWidgetDto) {
    await this.assertDashboard(organisationId, dto.dashboardId);
    const widget = await this.prisma.dashboardWidget.create({
      data: {
        organisationId,
        dashboardId: dto.dashboardId,
        title: dto.title,
        type: dto.type,
        config: dto.config as Prisma.InputJsonValue,
        position: (dto.position ?? {}) as Prisma.InputJsonValue,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.WIDGET_CREATED,
      'dashboardWidget',
      widget.id,
    );
    return widget;
  }

  async createMetric(organisationId: string, actorUserId: string, dto: CreateMetricDto) {
    const metric = await this.prisma.metric.create({
      data: { organisationId, key: dto.key, name: dto.name, type: dto.type, unit: dto.unit },
    });
    await this.auditRecord(
      organisationId,
      actorUserId,
      'analytics.metric.created',
      'metric',
      metric.id,
    );
    return metric;
  }

  async createKpi(organisationId: string, actorUserId: string, dto: CreateKpiDto) {
    const kpi = await this.prisma.kPI.create({
      data: { organisationId, metricId: dto.metricId, name: dto.name, target: dto.target },
    });
    await this.event(organisationId, actorUserId, AnalyticsEventType.KPI_CREATED, 'kpi', kpi.id);
    return kpi;
  }

  async createReport(organisationId: string, actorUserId: string, dto: CreateReportDto) {
    const report = await this.prisma.report.create({
      data: {
        organisationId,
        createdById: actorUserId,
        name: dto.name,
        type: dto.type,
        filters: (dto.filters ?? {}) as Prisma.InputJsonValue,
        configuration: { exportPdf: true, exportExcel: true, scheduledReports: true },
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.REPORT_GENERATED,
      'report',
      report.id,
    );
    return report;
  }

  async createForecast(organisationId: string, actorUserId: string, dto: CreateForecastDto) {
    const dashboard = await this.executiveDashboard(organisationId);
    const forecast = await this.prisma.forecast.create({
      data: {
        organisationId,
        type: dto.type,
        name: dto.name,
        horizonDays: dto.horizonDays ?? 90,
        inputSummary: dashboard,
        result: {
          status: 'architecture_ready',
          message: 'Forecasting pipeline prepared; predictive model execution disabled.',
        },
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.FORECAST_CREATED,
      'forecast',
      forecast.id,
    );
    return forecast;
  }

  async createChart(organisationId: string, actorUserId: string, dto: CreateChartDto) {
    const chart = await this.prisma.chartConfiguration.create({
      data: {
        organisationId,
        name: dto.name,
        type: dto.type,
        config: dto.config as Prisma.InputJsonValue,
      },
    });
    await this.auditRecord(
      organisationId,
      actorUserId,
      'analytics.chart.created',
      'chartConfiguration',
      chart.id,
    );
    return chart;
  }

  async createSnapshot(organisationId: string, actorUserId: string, dto: CreateSnapshotDto = {}) {
    const dashboard = await this.executiveDashboard(organisationId);
    const snapshotDate = dto.snapshotDate ? new Date(dto.snapshotDate) : new Date();
    const snapshot = await this.prisma.businessSnapshot.upsert({
      where: { organisationId_snapshotDate: { organisationId, snapshotDate } },
      update: {
        revenue: dashboard.revenue,
        projects: dashboard.activity.projects,
        customers: dashboard.salesPipeline.customers,
        tasks: dashboard.activity.tasks,
        documents: dashboard.activity.documents,
        automations: dashboard.activity.workflows,
        financialHealth: dashboard.companyHealthScore,
        data: dashboard,
      },
      create: {
        organisationId,
        snapshotDate,
        revenue: dashboard.revenue,
        projects: dashboard.activity.projects,
        customers: dashboard.salesPipeline.customers,
        tasks: dashboard.activity.tasks,
        documents: dashboard.activity.documents,
        automations: dashboard.activity.workflows,
        financialHealth: dashboard.companyHealthScore,
        data: dashboard,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.SNAPSHOT_CREATED,
      'businessSnapshot',
      snapshot.id,
    );
    return snapshot;
  }

  async createSavedView(organisationId: string, actorUserId: string, dto: CreateSavedViewDto) {
    const view = await this.prisma.savedView.create({
      data: {
        organisationId,
        createdById: actorUserId,
        dashboardId: dto.dashboardId,
        name: dto.name,
        config: dto.config as Prisma.InputJsonValue,
        shared: dto.shared ?? false,
      },
    });
    await this.event(
      organisationId,
      actorUserId,
      AnalyticsEventType.SAVED_VIEW_CREATED,
      'savedView',
      view.id,
    );
    return view;
  }

  private async assertDashboard(organisationId: string, id: string) {
    const dashboard = await this.prisma.dashboard.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!dashboard) throw new NotFoundException('Dashboard was not found.');
  }

  private delegate(delegate: AnalyticsDelegate) {
    return (this.prisma as unknown as Record<AnalyticsDelegate, AnalyticsModelDelegate>)[delegate];
  }

  private where(organisationId: string, query: ListAnalyticsDto) {
    return {
      organisationId,
      deletedAt: null,
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
    };
  }

  private healthScore(input: {
    revenue: number;
    profit: number;
    cashFlow: number;
    riskyProjects: number;
    outstanding: number;
  }) {
    let score = 72;
    if (input.revenue > 0) score += 8;
    if (input.profit > 0) score += 8;
    if (input.cashFlow > 0) score += 6;
    if (input.riskyProjects > 0) score -= Math.min(input.riskyProjects * 4, 20);
    if (input.outstanding > input.revenue * 0.4) score -= 8;
    return Math.max(0, Math.min(100, score));
  }

  private async event(
    organisationId: string,
    actorUserId: string,
    type: AnalyticsEventType,
    entityType: string,
    entityId: string,
  ) {
    await this.prisma.analyticsEvent.create({
      data: { organisationId, actorUserId, type, entityType, entityId },
    });
    await this.auditRecord(
      organisationId,
      actorUserId,
      `analytics.${type.toLowerCase()}`,
      entityType,
      entityId,
    );
  }

  private auditRecord(
    organisationId: string,
    actorUserId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    return this.audit.record({ organisationId, actorUserId, action, entityType, entityId });
  }
}
