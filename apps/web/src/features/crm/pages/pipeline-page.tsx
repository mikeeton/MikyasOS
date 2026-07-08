import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useMemo, useState } from 'react';

import { crmApi, type Lead } from '@/api/client';
import { cascadeItem, premiumSpring } from '@/features/workspace/motion/premium-motion';
import { AiPlaceholder } from '../components/ai-placeholder';
import { formatMoney, initials } from '../components/crm-format';
import { CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const columns = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

export function PipelinePage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [localStages, setLocalStages] = useState<Record<string, string>>({});
  const leads = useQuery({
    queryKey: ['crm', 'leads', organisationId, 'pipeline'],
    queryFn: () => crmApi.leads(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const grouped = useMemo(() => {
    const result = Object.fromEntries(columns.map((column) => [column, [] as Lead[]]));
    (leads.data?.items ?? []).forEach((lead) => {
      const stage = localStages[lead.id] ?? mapLeadToPipeline(lead.status);
      result[stage]?.push(lead);
    });
    return result;
  }, [leads.data?.items, localStages]);

  return (
    <CrmShell
      title="Lead Pipeline"
      description="A fast visual board for moving leads through qualification. Drag cards between columns for a local quick-edit preview."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <AiPlaceholder kind="leadInsights" compact />
        <AiPlaceholder kind="opportunitySuggestions" compact />
        <AiPlaceholder kind="riskDetection" compact />
      </div>
      {leads.isLoading ? (
        <CrmSkeleton rows={6} />
      ) : leads.isError ? (
        <CrmErrorState onRetry={() => void leads.refetch()} />
      ) : (
        <div className="grid gap-4 overflow-x-auto xl:grid-cols-6">
          {columns.map((column) => (
            <motion.section
              key={column}
              layout
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const leadId = event.dataTransfer.getData('text/plain');
                setLocalStages((state) => ({ ...state, [leadId]: column }));
              }}
              className="min-h-[32rem] min-w-64 premium-card p-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{column}</h3>
                <span className="rounded bg-muted px-2 py-1 text-xs">
                  {grouped[column]?.length ?? 0}
                </span>
              </div>
              <div className="mt-3 grid gap-3">
                {grouped[column]?.map((lead) => (
                  <motion.article
                    key={lead.id}
                    layout
                    variants={cascadeItem}
                    initial="initial"
                    animate="animate"
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    transition={premiumSpring}
                    draggable
                    onDragStartCapture={(event) =>
                      event.dataTransfer.setData('text/plain', lead.id)
                    }
                    className="cursor-grab rounded-md border border-border bg-muted/30 p-3 shadow-sm transition hover:bg-accent active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          {lead.company?.name ?? 'Unassigned lead'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.source ?? 'No source'}
                        </p>
                      </div>
                      <GripVertical className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span>{formatMoney(lead.estimatedValue)}</span>
                      <span>{lead.probability}%</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${lead.probability}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="grid size-6 place-items-center rounded-full bg-background">
                        {initials(lead.assignee?.name)}
                      </span>
                      <span>Activity ready</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </CrmShell>
  );
}

const mapLeadToPipeline = (status: string) => {
  if (status === 'CONTACTED') return 'QUALIFIED';
  if (status === 'CONVERTED') return 'WON';
  if (status === 'LOST' || status === 'UNQUALIFIED') return 'LOST';
  return columns.includes(status) ? status : 'NEW';
};
