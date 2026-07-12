# Business Intelligence & Analytics

Milestone 11 adds the mikyasOS business intelligence layer. Analytics turns operational data from CRM, projects, documents, finance, automation, communication, and AI into dashboards, KPIs, reports, forecasts, and executive snapshots.

## Architecture

Backend module:

- `AnalyticsModule`
- `DashboardsModule`
- `MetricsModule`
- `ReportsModule`
- `ForecastingModule`
- `ChartsModule`
- `DataAggregationModule`
- `SnapshotModule`
- `InsightsModule`

Core service:

- `AnalyticsService` handles dashboard records, widgets, metrics, KPI targets, report definitions, chart configurations, forecast records, saved views, snapshots, analytics events, aggregation, and audit logging.

AI preparation services:

- `ExecutiveBriefingService`
- `BusinessHealthService`
- `ForecastService`
- `RiskAnalysisService`
- `RecommendationService`
- `TrendDetectionService`

These services expose deterministic architecture only. LLM generation is intentionally disabled until a later milestone.

## Database Models

Analytics adds:

- `Dashboard`
- `DashboardWidget`
- `Metric`
- `MetricValue`
- `KPI`
- `Report`
- `ReportSchedule`
- `DataSource`
- `ChartConfiguration`
- `Forecast`
- `BusinessSnapshot`
- `AnalyticsEvent`
- `AnalyticsFilter`
- `SavedView`

Records are organisation-scoped, UUID-based, timestamped, soft-deletable where useful, indexed, and linked to the creating user where appropriate.

## Executive Dashboard

The executive endpoint aggregates:

- revenue
- expenses
- profit
- cash flow
- customer growth
- lead pipeline
- project completion
- blocked projects
- task velocity
- document activity
- automation usage
- meeting activity
- outstanding invoices

The output also includes prepared placeholders for AI executive briefing, business health, risks, recommendations, and trend detection.

## Reports

Prepared report categories:

- Revenue
- Expense
- Sales
- Project
- CRM
- Employee
- Automation
- AI Usage
- Executive Summary

Report records can store filters, columns, chart configuration, schedule architecture, and export placeholders.

## Charts

Supported chart configuration types:

- line
- bar
- area
- pie
- scatter
- heatmap
- treemap
- gauge
- funnel
- radar

Chart records store query configuration, visual configuration, filters, and refresh metadata. Rendering happens in the frontend through reusable analytics components.

## Forecasting

Forecast records prepare architecture for:

- revenue forecast
- cash flow forecast
- sales forecast
- project delivery forecast
- resource forecast

No predictive model or LLM-generated forecast is executed yet.

## API

All endpoints are under `/api/v1/analytics` and require JWT auth plus organisation isolation.

- `GET /capabilities`
- `GET /executive`
- `GET /dashboards`
- `POST /dashboards`
- `POST /widgets`
- `GET /metrics`
- `POST /metrics`
- `GET /kpis`
- `POST /kpis`
- `GET /reports`
- `POST /reports`
- `GET /forecasts`
- `POST /forecasts`
- `GET /snapshots`
- `POST /snapshots`
- `GET /charts`
- `POST /charts`
- `POST /saved-views`

## Frontend Routes

- `/app/analytics`
- `/app/dashboards`
- `/app/reports`
- `/app/kpis`
- `/app/forecasts`
- `/app/snapshots`

The UI includes an executive overview, KPI cards, business health, chart wall, dashboard builder, report builder, forecast center, and snapshot history.

## Security

Analytics uses:

- JWT auth
- organisation isolation
- permission guards
- analytics permissions
- audit logging
- validation for chart, report, dashboard, KPI, and forecast inputs
- no cross-tenant aggregation

## Developer Guide

Useful commands:

```bash
npm run prisma:generate -w @mikyasos/api
npm run typecheck
npm run lint
npm test
npm run build
docker compose up -d
```

Manual smoke flow:

1. Register or log in.
2. Create or switch to an organisation.
3. Open `/app/analytics`.
4. Create a dashboard from `/app/dashboards`.
5. Create a KPI from `/app/kpis`.
6. Create a report from `/app/reports`.
7. Verify `/api/v1/analytics/capabilities` and `/api/v1/analytics/executive`.

## Future Work

Milestone 12 can expand into:

- dedicated calendar BI
- drill-down report designer
- scheduled report delivery
- export to PDF and CSV
- richer chart rendering
- true trend detection
- predictive models
- LLM-generated executive briefings with citations
- warehouse and external data connectors
