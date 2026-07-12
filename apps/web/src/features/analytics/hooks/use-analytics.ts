import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { analyticsApi, type AnalyticsQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useAnalyticsContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  capabilities: (organisationId: string | null) =>
    [...analyticsKeys.all, 'capabilities', organisationId] as const,
  executive: (organisationId: string | null) =>
    [...analyticsKeys.all, 'executive', organisationId] as const,
  list: (organisationId: string | null, resource: string, query: AnalyticsQuery) =>
    [...analyticsKeys.all, resource, organisationId, query] as const,
};

export function useAnalyticsCapabilities() {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.capabilities(organisationId),
    queryFn: () => analyticsApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useExecutiveAnalytics() {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.executive(organisationId),
    queryFn: () => analyticsApi.executive(token!, organisationId!),
    enabled,
  });
}

export function useAnalyticsDashboards(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'dashboards', query),
    queryFn: () => analyticsApi.dashboards(token!, organisationId!, query),
    enabled,
  });
}

export function useAnalyticsReports(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'reports', query),
    queryFn: () => analyticsApi.reports(token!, organisationId!, query),
    enabled,
  });
}

export function useAnalyticsKpis(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'kpis', query),
    queryFn: () => analyticsApi.kpis(token!, organisationId!, query),
    enabled,
  });
}

export function useAnalyticsForecasts(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'forecasts', query),
    queryFn: () => analyticsApi.forecasts(token!, organisationId!, query),
    enabled,
  });
}

export function useAnalyticsSnapshots(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'snapshots', query),
    queryFn: () => analyticsApi.snapshots(token!, organisationId!, query),
    enabled,
  });
}

export function useAnalyticsCharts(query: AnalyticsQuery = {}) {
  const { token, organisationId, enabled } = useAnalyticsContext();
  return useQuery({
    queryKey: analyticsKeys.list(organisationId, 'charts', query),
    queryFn: () => analyticsApi.charts(token!, organisationId!, query),
    enabled,
  });
}

export function useCreateAnalyticsDashboard() {
  const { token, organisationId } = useAnalyticsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      analyticsApi.createDashboard(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  });
}

export function useCreateAnalyticsReport() {
  const { token, organisationId } = useAnalyticsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; type: string }) =>
      analyticsApi.createReport(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  });
}

export function useCreateAnalyticsKpi() {
  const { token, organisationId } = useAnalyticsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; target?: number }) =>
      analyticsApi.createKpi(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  });
}

export function useCreateAnalyticsForecast() {
  const { token, organisationId } = useAnalyticsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; type: string }) =>
      analyticsApi.createForecast(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  });
}

export function useCreateAnalyticsSnapshot() {
  const { token, organisationId } = useAnalyticsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analyticsApi.createSnapshot(token!, organisationId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  });
}

export function useTrackProductEvent() {
  const { token, organisationId } = useAnalyticsContext();
  return useMutation({
    mutationFn: (body: {
      name: string;
      source?: string;
      entityType?: string;
      entityId?: string;
      metadata?: Record<string, unknown>;
    }) => analyticsApi.trackEvent(token!, organisationId!, body),
  });
}
