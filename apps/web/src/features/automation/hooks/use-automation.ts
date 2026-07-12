import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  automationApi,
  type AutomationQuery,
  type CreateWorkflowBody,
  type WorkflowSchedule,
} from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useAutomationContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const automationKeys = {
  all: ['automation'] as const,
  capabilities: (organisationId: string | null) =>
    [...automationKeys.all, 'capabilities', organisationId] as const,
  workflows: (organisationId: string | null, query: AutomationQuery) =>
    [...automationKeys.all, 'workflows', organisationId, query] as const,
  executions: (organisationId: string | null) =>
    [...automationKeys.all, 'executions', organisationId] as const,
  history: (organisationId: string | null) =>
    [...automationKeys.all, 'history', organisationId] as const,
  logs: (organisationId: string | null) => [...automationKeys.all, 'logs', organisationId] as const,
  templates: (organisationId: string | null) =>
    [...automationKeys.all, 'templates', organisationId] as const,
  schedules: (organisationId: string | null) =>
    [...automationKeys.all, 'schedules', organisationId] as const,
  variables: (organisationId: string | null) =>
    [...automationKeys.all, 'variables', organisationId] as const,
  approvals: (organisationId: string | null) =>
    [...automationKeys.all, 'approvals', organisationId] as const,
};

export function useAutomationCapabilities() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.capabilities(organisationId),
    queryFn: () => automationApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useWorkflows(query: AutomationQuery = {}) {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.workflows(organisationId, query),
    queryFn: () => automationApi.workflows(token!, organisationId!, query),
    enabled,
  });
}

export function useWorkflowExecutions() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.executions(organisationId),
    queryFn: () => automationApi.executions(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowHistory() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.history(organisationId),
    queryFn: () => automationApi.history(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowLogs() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.logs(organisationId),
    queryFn: () => automationApi.logs(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowTemplates() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.templates(organisationId),
    queryFn: () => automationApi.templates(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowSchedules() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.schedules(organisationId),
    queryFn: () => automationApi.schedules(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowVariables() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.variables(organisationId),
    queryFn: () => automationApi.variables(token!, organisationId!),
    enabled,
  });
}

export function useWorkflowApprovals() {
  const { token, organisationId, enabled } = useAutomationContext();
  return useQuery({
    queryKey: automationKeys.approvals(organisationId),
    queryFn: () => automationApi.approvals(token!, organisationId!),
    enabled,
  });
}

export function useCreateWorkflow() {
  const { token, organisationId } = useAutomationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateWorkflowBody) =>
      automationApi.createWorkflow(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: automationKeys.all }),
  });
}

export function useExecuteWorkflow() {
  const { token, organisationId } = useAutomationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload = {} }: { id: string; payload?: Record<string, unknown> }) =>
      automationApi.executeWorkflow(token!, organisationId!, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: automationKeys.all }),
  });
}

export function useCreateWorkflowSchedule() {
  const { token, organisationId } = useAutomationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      body: Pick<WorkflowSchedule, 'workflowId' | 'type'> &
        Partial<Pick<WorkflowSchedule, 'cronExpression' | 'timezone'>>,
    ) => automationApi.createSchedule(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: automationKeys.all }),
  });
}
