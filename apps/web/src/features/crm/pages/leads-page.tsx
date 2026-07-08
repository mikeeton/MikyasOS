import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { AiPlaceholder } from '../components/ai-placeholder';
import { CrmFilters } from '../components/crm-filters';
import { formatDate, formatMoney } from '../components/crm-format';
import { CrmEmptyState, CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST'];

export function LeadsPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const leads = useQuery({
    queryKey: ['crm', 'leads', organisationId, search, status],
    queryFn: () => crmApi.leads(token!, organisationId!, { search, status, pageSize: 50 }),
    enabled,
  });
  const createLead = useMutation({
    mutationFn: () =>
      crmApi.createLead(token!, organisationId!, {
        source: 'Manual',
        status: 'NEW',
        probability: 10,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['crm', 'leads'] }),
  });

  return (
    <CrmShell
      title="Leads"
      description="Track every signal that could become a customer relationship. Assign ownership, qualify quickly, and move good leads forward."
      actions={
        <Button onClick={() => createLead.mutate()}>
          <Plus className="mr-2 size-4" /> Create Lead
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AiPlaceholder kind="leadInsights" compact />
        <AiPlaceholder kind="nextBestAction" compact />
      </div>
      <CrmFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statuses={leadStatuses}
      />
      {leads.isLoading ? (
        <CrmSkeleton rows={7} />
      ) : leads.isError ? (
        <CrmErrorState onRetry={() => void leads.refetch()} />
      ) : leads.data?.items.length === 0 ? (
        <CrmEmptyState
          title="No leads yet"
          description="Create leads from campaigns, imports, inbound requests, and future automation."
          actionLabel="Open pipeline"
          actionTo="/app/crm/pipeline"
        />
      ) : (
        <div className="overflow-hidden premium-card">
          <table className="w-full min-w-[840px] text-sm">
            <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Probability</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Expected Close</th>
              </tr>
            </thead>
            <tbody>
              {leads.data?.items.map((lead) => (
                <tr key={lead.id} className="premium-row">
                  <td className="px-4 py-3 font-medium">{lead.company?.name ?? 'Unassigned'}</td>
                  <td className="px-4 py-3">{lead.source ?? '—'}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                  <td className="px-4 py-3">{formatMoney(lead.estimatedValue)}</td>
                  <td className="px-4 py-3">{lead.probability}%</td>
                  <td className="px-4 py-3">{lead.assignee?.name ?? 'No owner'}</td>
                  <td className="px-4 py-3">{formatDate(lead.expectedCloseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CrmShell>
  );
}
