import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { financeApi, type CreateInvoiceBody, type FinanceQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useFinanceContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const financeKeys = {
  all: ['finance'] as const,
  capabilities: (organisationId: string | null) =>
    [...financeKeys.all, 'capabilities', organisationId] as const,
  dashboard: (organisationId: string | null) =>
    [...financeKeys.all, 'dashboard', organisationId] as const,
  list: (organisationId: string | null, resource: string, query: FinanceQuery) =>
    [...financeKeys.all, resource, organisationId, query] as const,
  reportSummary: (organisationId: string | null) =>
    [...financeKeys.all, 'report-summary', organisationId] as const,
};

export function useFinanceCapabilities() {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.capabilities(organisationId),
    queryFn: () => financeApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useFinanceDashboard() {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.dashboard(organisationId),
    queryFn: () => financeApi.dashboard(token!, organisationId!),
    enabled,
  });
}

export function useInvoices(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'invoices', query),
    queryFn: () => financeApi.invoices(token!, organisationId!, query),
    enabled,
  });
}

export function useQuotes(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'quotes', query),
    queryFn: () => financeApi.quotes(token!, organisationId!, query),
    enabled,
  });
}

export function usePayments(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'payments', query),
    queryFn: () => financeApi.payments(token!, organisationId!, query),
    enabled,
  });
}

export function useExpenses(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'expenses', query),
    queryFn: () => financeApi.expenses(token!, organisationId!, query),
    enabled,
  });
}

export function usePurchaseOrders(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'purchase-orders', query),
    queryFn: () => financeApi.purchaseOrders(token!, organisationId!, query),
    enabled,
  });
}

export function useBudgets(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'budgets', query),
    queryFn: () => financeApi.budgets(token!, organisationId!, query),
    enabled,
  });
}

export function useCashFlow(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'cashflow', query),
    queryFn: () => financeApi.cashFlow(token!, organisationId!, query),
    enabled,
  });
}

export function useFinancialReports(query: FinanceQuery = {}) {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.list(organisationId, 'reports', query),
    queryFn: () => financeApi.reports(token!, organisationId!, query),
    enabled,
  });
}

export function useFinanceReportSummary() {
  const { token, organisationId, enabled } = useFinanceContext();
  return useQuery({
    queryKey: financeKeys.reportSummary(organisationId),
    queryFn: () => financeApi.reportSummary(token!, organisationId!),
    enabled,
  });
}

export function useCreateInvoice() {
  const { token, organisationId } = useFinanceContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInvoiceBody) =>
      financeApi.createInvoice(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
}

export function useCreateQuote() {
  const { token, organisationId } = useFinanceContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<CreateInvoiceBody>) =>
      financeApi.createQuote(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
}

export function useCreateExpense() {
  const { token, organisationId } = useFinanceContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; amount: number; tax?: number }) =>
      financeApi.createExpense(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
}
