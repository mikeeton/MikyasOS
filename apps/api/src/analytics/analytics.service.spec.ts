import { AnalyticsEventType, ChartType, ForecastType, MetricType } from '@prisma/client';

import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  function aggregatePrisma() {
    return {
      $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
      invoice: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { total: 1000, balance: 250 }, _count: 3 }),
      },
      expense: { aggregate: jest.fn().mockResolvedValue({ _sum: { total: 300 }, _count: 2 }) },
      cashFlowEntry: {
        aggregate: jest
          .fn()
          .mockResolvedValueOnce({ _sum: { amount: 900 } })
          .mockResolvedValueOnce({ _sum: { amount: 200 } }),
      },
      company: { count: jest.fn().mockResolvedValue(8) },
      lead: { count: jest.fn().mockResolvedValue(4) },
      project: { count: jest.fn().mockResolvedValueOnce(5).mockResolvedValueOnce(1) },
      task: { count: jest.fn().mockResolvedValue(12) },
      document: { count: jest.fn().mockResolvedValue(7) },
      workflow: { count: jest.fn().mockResolvedValue(3) },
      meeting: { count: jest.fn().mockResolvedValue(2) },
    };
  }

  it('builds an executive dashboard from cross-module aggregates', async () => {
    const prisma = aggregatePrisma();
    const service = new AnalyticsService(prisma as never, {} as never);

    const dashboard = await service.executiveDashboard('org-id');

    expect(dashboard.revenue).toBe(1000);
    expect(dashboard.expenses).toBe(300);
    expect(dashboard.profit).toBe(700);
    expect(dashboard.cashFlow).toBe(700);
    expect(dashboard.projectsAtRisk).toBe(1);
    expect(dashboard.companyHealthScore).toBeGreaterThan(0);
  });

  it('creates dashboards and records analytics events', async () => {
    type DashboardCreateInput = {
      data: { organisationId: string; createdById: string };
    };
    type AnalyticsEventCreateInput = {
      data: { type: AnalyticsEventType };
    };
    const dashboardCreate = jest
      .fn<Promise<{ id: string; name: string }>, [DashboardCreateInput]>()
      .mockResolvedValue({ id: 'dashboard-id', name: 'Executive' });
    const analyticsEventCreate = jest
      .fn<Promise<{ id: string }>, [AnalyticsEventCreateInput]>()
      .mockResolvedValue({ id: 'event-id' });
    const prisma = {
      dashboard: {
        create: dashboardCreate,
      },
      analyticsEvent: { create: analyticsEventCreate },
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new AnalyticsService(prisma as never, audit as never);

    await service.createDashboard('org-id', 'user-id', { name: 'Executive' });

    const dashboardCreateCall = dashboardCreate.mock.calls[0]?.[0];
    const analyticsEventCreateCall = analyticsEventCreate.mock.calls[0]?.[0];
    expect(dashboardCreateCall).toMatchObject({
      data: { organisationId: 'org-id', createdById: 'user-id' },
    });
    expect(analyticsEventCreateCall).toMatchObject({
      data: { type: AnalyticsEventType.DASHBOARD_VIEWED },
    });
  });

  it('creates metrics, charts, and forecast architecture records', async () => {
    type ForecastCreateInput = {
      data: { result: { status: string } };
    };
    const forecastCreate = jest
      .fn<Promise<{ id: string }>, [ForecastCreateInput]>()
      .mockResolvedValue({ id: 'forecast-id' });
    const prisma = {
      ...aggregatePrisma(),
      metric: { create: jest.fn().mockResolvedValue({ id: 'metric-id' }) },
      chartConfiguration: { create: jest.fn().mockResolvedValue({ id: 'chart-id' }) },
      forecast: { create: forecastCreate },
      analyticsEvent: { create: jest.fn().mockResolvedValue({ id: 'event-id' }) },
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    const service = new AnalyticsService(prisma as never, audit as never);

    await service.createMetric('org-id', 'user-id', {
      key: 'revenue',
      name: 'Revenue',
      type: MetricType.REVENUE,
    });
    await service.createChart('org-id', 'user-id', {
      name: 'Revenue trend',
      type: ChartType.LINE,
      config: { x: 'date', y: 'revenue' },
    });
    await service.createForecast('org-id', 'user-id', {
      name: 'Revenue forecast',
      type: ForecastType.REVENUE,
    });

    expect(prisma.metric.create).toHaveBeenCalled();
    expect(prisma.chartConfiguration.create).toHaveBeenCalled();
    const forecastCreateCall = forecastCreate.mock.calls[0]?.[0];
    expect(forecastCreateCall).toMatchObject({
      data: {
        result: { status: 'architecture_ready' },
      },
    });
  });
});
