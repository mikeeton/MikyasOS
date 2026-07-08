import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

export function useCrmContext() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();

  return {
    token: accessToken,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(accessToken && currentOrganisation?.id),
  };
}
