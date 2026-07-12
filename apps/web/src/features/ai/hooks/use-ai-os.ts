import { useMutation, useQuery } from '@tanstack/react-query';

import { aiOsApi } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useAiContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();

  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const aiKeys = {
  all: ['ai-os'] as const,
  capabilities: (organisationId: string | null) =>
    [...aiKeys.all, 'capabilities', organisationId] as const,
  prompts: (organisationId: string | null) => [...aiKeys.all, 'prompts', organisationId] as const,
  memory: (organisationId: string | null) => [...aiKeys.all, 'memory', organisationId] as const,
  settings: (organisationId: string | null) => [...aiKeys.all, 'settings', organisationId] as const,
  retrieval: (organisationId: string | null) =>
    [...aiKeys.all, 'retrieval', organisationId] as const,
  actions: (organisationId: string | null) => [...aiKeys.all, 'actions', organisationId] as const,
  conversations: (organisationId: string | null) =>
    [...aiKeys.all, 'conversations', organisationId] as const,
};

export function useAiCapabilities() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.capabilities(organisationId),
    queryFn: () => aiOsApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useAiPrompts() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.prompts(organisationId),
    queryFn: () => aiOsApi.prompts(token!, organisationId!),
    enabled,
  });
}

export function useAiMemory() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.memory(organisationId),
    queryFn: () => aiOsApi.memory(token!, organisationId!),
    enabled,
  });
}

export function useAiSettings() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.settings(organisationId),
    queryFn: () => aiOsApi.settings(token!, organisationId!),
    enabled,
  });
}

export function useAiRetrievalStatus() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.retrieval(organisationId),
    queryFn: () => aiOsApi.retrievalStatus(token!, organisationId!),
    enabled,
  });
}

export function useAiActions() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.actions(organisationId),
    queryFn: () => aiOsApi.actions(token!, organisationId!),
    enabled,
  });
}

export function useAiConversations() {
  const { token, organisationId, enabled } = useAiContext();
  return useQuery({
    queryKey: aiKeys.conversations(organisationId),
    queryFn: () => aiOsApi.conversations(token!, organisationId!),
    enabled,
  });
}

export function useAiOrchestrate() {
  const { token, organisationId } = useAiContext();
  return useMutation({
    mutationFn: (body: { message: string; currentPage?: string }) =>
      aiOsApi.orchestrate(token!, organisationId!, body),
  });
}
