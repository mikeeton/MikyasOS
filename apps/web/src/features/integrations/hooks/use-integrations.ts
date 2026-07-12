import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { integrationsApi, type IntegrationsQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useIntegrationsContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const integrationKeys = {
  all: ['integrations'] as const,
  capabilities: (organisationId: string | null) =>
    [...integrationKeys.all, 'capabilities', organisationId] as const,
  marketplace: (organisationId: string | null) =>
    [...integrationKeys.all, 'marketplace', organisationId] as const,
  list: (organisationId: string | null, resource: string, query: IntegrationsQuery) =>
    [...integrationKeys.all, resource, organisationId, query] as const,
  oauth: (organisationId: string | null, provider: string) =>
    [...integrationKeys.all, 'oauth', organisationId, provider] as const,
};

export function useIntegrationCapabilities() {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.capabilities(organisationId),
    queryFn: () => integrationsApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useMarketplaceConnectors() {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.marketplace(organisationId),
    queryFn: () => integrationsApi.marketplace(token!, organisationId!),
    enabled,
  });
}

export function useInstalledIntegrations(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'installed', query),
    queryFn: () => integrationsApi.installed(token!, organisationId!, query),
    enabled,
  });
}

export function useIntegrationConnections(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'connections', query),
    queryFn: () => integrationsApi.connections(token!, organisationId!, query),
    enabled,
  });
}

export function useIntegrationSyncs(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'syncs', query),
    queryFn: () => integrationsApi.syncs(token!, organisationId!, query),
    enabled,
  });
}

export function useIntegrationWebhooks(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'webhooks', query),
    queryFn: () => integrationsApi.webhooks(token!, organisationId!, query),
    enabled,
  });
}

export function useIntegrationLogs(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'logs', query),
    queryFn: () => integrationsApi.logs(token!, organisationId!, query),
    enabled,
  });
}

export function useIntegrationHealth(query: IntegrationsQuery = {}) {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.list(organisationId, 'health', query),
    queryFn: () => integrationsApi.health(token!, organisationId!, query),
    enabled,
  });
}

export function useOAuthArchitecture(provider = 'google') {
  const { token, organisationId, enabled } = useIntegrationsContext();
  return useQuery({
    queryKey: integrationKeys.oauth(organisationId, provider),
    queryFn: () => integrationsApi.oauth(token!, organisationId!, provider),
    enabled,
  });
}

export function useInstallConnector() {
  const { token, organisationId } = useIntegrationsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectorKey: string) =>
      integrationsApi.install(token!, organisationId!, connectorKey),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: integrationKeys.all }),
  });
}

export function useStartIntegrationSync() {
  const { token, organisationId } = useIntegrationsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { integrationId: string; mode: string; entity: string }) =>
      integrationsApi.startSync(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: integrationKeys.all }),
  });
}
