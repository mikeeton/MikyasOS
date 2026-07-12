import { useQuery } from '@tanstack/react-query';

import { billingApi, type AdminQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useBillingContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();

  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const billingKeys = {
  all: ['billing'] as const,
  resource: (organisationId: string | null, resource: string, query: AdminQuery = {}) =>
    [...billingKeys.all, organisationId, resource, query] as const,
};

export function useBillingOverview() {
  const { token, organisationId, enabled } = useBillingContext();
  return useQuery({
    queryKey: billingKeys.resource(organisationId, 'overview'),
    queryFn: () => billingApi.overview(token!, organisationId!),
    enabled,
  });
}

export function useBillingPlans() {
  const { token, organisationId, enabled } = useBillingContext();
  return useQuery({
    queryKey: billingKeys.resource(organisationId, 'plans'),
    queryFn: () => billingApi.plans(token!, organisationId!),
    enabled,
  });
}

export function useBillingResource(resource: string, query: AdminQuery = {}) {
  const { token, organisationId, enabled } = useBillingContext();
  const loaders = {
    subscriptions: billingApi.subscriptions,
    usage: billingApi.usage,
    checkout: billingApi.checkout,
    portal: billingApi.portal,
    imports: billingApi.imports,
    exports: billingApi.exports,
  } as const;

  return useQuery({
    queryKey: billingKeys.resource(organisationId, resource, query),
    queryFn: () => loaders[resource as keyof typeof loaders](token!, organisationId!, query),
    enabled,
  });
}

export function useLaunchChecklist() {
  const { token, organisationId, enabled } = useBillingContext();
  return useQuery({
    queryKey: billingKeys.resource(organisationId, 'launch-checklist'),
    queryFn: () => billingApi.launchChecklist(token!, organisationId!),
    enabled,
  });
}
