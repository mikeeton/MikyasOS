import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { crmApi } from '@/api/client';
import { AiPlaceholder } from '../components/ai-placeholder';
import { CrmFilters } from '../components/crm-filters';
import { formatDate, formatMoney } from '../components/crm-format';
import { CrmEmptyState, CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const opportunityStatuses = ['OPEN', 'WON', 'LOST', 'ARCHIVED'];

export function OpportunitiesPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const opportunities = useQuery({
    queryKey: ['crm', 'opportunities', organisationId, search, status],
    queryFn: () => crmApi.opportunities(token!, organisationId!, { search, status, pageSize: 50 }),
    enabled,
  });

  return (
    <CrmShell
      title="Opportunities"
      description="Expected revenue, stage, probability, owner, close date, company context, and deal activity."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AiPlaceholder kind="opportunitySuggestions" compact />
        <AiPlaceholder kind="salesCoach" compact />
      </div>
      <CrmFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statuses={opportunityStatuses}
      />
      {opportunities.isLoading ? (
        <CrmSkeleton rows={7} />
      ) : opportunities.isError ? (
        <CrmErrorState onRetry={() => void opportunities.refetch()} />
      ) : opportunities.data?.items.length === 0 ? (
        <CrmEmptyState
          title="No opportunities yet"
          description="Create opportunities from qualified leads when real deal motion starts."
          actionLabel="Open pipeline"
          actionTo="/app/crm/pipeline"
        />
      ) : (
        <div className="grid gap-3">
          {opportunities.data?.items.map((opportunity) => (
            <article key={opportunity.id} className="premium-card p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium">
                    {opportunity.company?.name ?? 'Unassigned opportunity'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.stage} · {opportunity.status}
                  </p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-4 lg:w-[42rem]">
                  <span>
                    <span className="block text-xs text-muted-foreground">Expected Revenue</span>
                    {formatMoney(opportunity.estimatedRevenue)}
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Probability</span>
                    {opportunity.probability}%
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Owner</span>
                    {opportunity.ownerUser?.name ?? 'No owner'}
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Close</span>
                    {formatDate(opportunity.expectedCloseDate)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </CrmShell>
  );
}
