import { useQuery } from '@tanstack/react-query';

import { enterpriseApi, platformApi, type AdminQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useAdminContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const adminKeys = {
  all: ['admin'] as const,
  resource: (organisationId: string | null, resource: string, query: AdminQuery = {}) =>
    [...adminKeys.all, organisationId, resource, query] as const,
};

export function useEnterpriseDashboard() {
  const { token, organisationId, enabled } = useAdminContext();
  return useQuery({
    queryKey: adminKeys.resource(organisationId, 'enterprise-dashboard'),
    queryFn: () => enterpriseApi.dashboard(token!, organisationId!),
    enabled,
  });
}

export function useEnterpriseCapabilities() {
  const { token, organisationId, enabled } = useAdminContext();
  return useQuery({
    queryKey: adminKeys.resource(organisationId, 'enterprise-capabilities'),
    queryFn: () => enterpriseApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useEnterpriseResource(resource: string, query: AdminQuery = {}) {
  const { token, organisationId, enabled } = useAdminContext();
  const loaders = {
    businessUnits: enterpriseApi.businessUnits,
    roles: enterpriseApi.roles,
    policies: enterpriseApi.policies,
    audit: enterpriseApi.audit,
    compliance: enterpriseApi.compliance,
  } as const;
  return useQuery({
    queryKey: adminKeys.resource(organisationId, `enterprise-${resource}`, query),
    queryFn: () => loaders[resource as keyof typeof loaders](token!, organisationId!, query),
    enabled,
  });
}

export function usePlatformOverview() {
  const { token, organisationId, enabled } = useAdminContext();
  return useQuery({
    queryKey: adminKeys.resource(organisationId, 'platform-overview'),
    queryFn: () => platformApi.overview(token!, organisationId!),
    enabled,
  });
}

export function usePlatformHealthDetails() {
  const { token, organisationId, enabled } = useAdminContext();
  return useQuery({
    queryKey: adminKeys.resource(organisationId, 'platform-health-details'),
    queryFn: () => platformApi.healthDetails(token!, organisationId!),
    enabled,
  });
}

export function usePlatformResource(resource: string, query: AdminQuery = {}) {
  const { token, organisationId, enabled } = useAdminContext();
  const loaders = {
    health: platformApi.health,
    incidents: platformApi.incidents,
    backups: platformApi.backups,
    deployments: platformApi.deployments,
    featureFlags: platformApi.featureFlags,
    jobs: platformApi.jobs,
    costs: platformApi.costs,
  } as const;
  return useQuery({
    queryKey: adminKeys.resource(organisationId, `platform-${resource}`, query),
    queryFn: () => loaders[resource as keyof typeof loaders](token!, organisationId!, query),
    enabled,
  });
}
