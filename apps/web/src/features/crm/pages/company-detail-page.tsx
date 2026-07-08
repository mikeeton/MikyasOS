import { useQuery } from '@tanstack/react-query';
import {
  BriefcaseBusiness,
  Edit,
  FileText,
  MessageSquare,
  Receipt,
  Tags,
  UsersRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { AiPlaceholder } from '../components/ai-placeholder';
import { formatDate, formatMoney } from '../components/crm-format';
import { CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

export function CompanyDetailPage() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useCrmContext();
  const company = useQuery({
    queryKey: ['crm', 'company', organisationId, id],
    queryFn: () => crmApi.company(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });

  if (company.isLoading) {
    return <CrmSkeleton rows={8} />;
  }
  if (company.isError || !company.data) {
    return <CrmErrorState onRetry={() => void company.refetch()} />;
  }

  const item = company.data;

  return (
    <CrmShell
      title={item.name}
      description={`${item.industry ?? 'Customer'} profile with contacts, opportunities, timeline, notes, files, and future intelligence surfaces.`}
      actions={
        <Button asChild>
          <Link to={`/app/crm/companies/${item.id}/edit`}>
            <Edit className="mr-2 size-4" aria-hidden="true" />
            Edit company
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="grid gap-6">
          <section className="premium-card p-5">
            <h3 className="font-semibold">Company Overview</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Fact label="Status" value={item.status} />
              <Fact label="Revenue" value={formatMoney(item.annualRevenue)} />
              <Fact
                label="Location"
                value={[item.city, item.country].filter(Boolean).join(', ') || 'Not set'}
              />
              <Fact label="Website" value={item.website ?? 'Not set'} />
              <Fact label="Email" value={item.email ?? 'Not set'} />
              <Fact label="Created" value={formatDate(item.createdAt)} />
            </div>
          </section>
          <GridSection
            title="Contacts"
            icon={UsersRound}
            items={
              item.contacts?.map((contact) => `${contact.firstName} ${contact.lastName}`) ?? []
            }
          />
          <GridSection
            title="Open Opportunities"
            icon={BriefcaseBusiness}
            items={
              item.opportunities?.map(
                (opportunity) =>
                  `${opportunity.stage} · ${formatMoney(opportunity.estimatedRevenue)}`,
              ) ?? []
            }
          />
          <GridSection
            title="Lead History"
            icon={MessageSquare}
            items={
              item.leads?.map((lead) => `${lead.status} · ${lead.source ?? 'No source'}`) ?? []
            }
          />
          <section className="premium-card p-5">
            <h3 className="font-semibold">Activity Timeline</h3>
            <div className="mt-4 grid gap-3">
              {item.activities?.length ? (
                item.activities.map((activity) => (
                  <div key={activity.id} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.type} · {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
          </section>
        </div>
        <aside className="grid content-start gap-4">
          <GridSection
            title="Customer Notes"
            icon={FileText}
            items={item.notes?.map((note) => note.content) ?? []}
            compact
          />
          <GridSection
            title="Files"
            icon={FileText}
            items={item.files?.map((file) => file.originalFilename) ?? []}
            compact
          />
          <GridSection
            title="Tags"
            icon={Tags}
            items={item.tags?.map(({ tag }) => tag.name) ?? []}
            compact
          />
          <AiPlaceholder kind="customerSummary" compact />
          <AiPlaceholder kind="riskDetection" compact />
          <AiPlaceholder kind="nextBestAction" compact />
          <Placeholder icon={MessageSquare} title="Communication" />
          <Placeholder icon={BriefcaseBusiness} title="Related Projects" />
          <Placeholder icon={Receipt} title="Financial" />
        </aside>
      </div>
    </CrmShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function GridSection({
  title,
  icon: Icon,
  items,
  compact = false,
}: {
  title: string;
  icon: typeof FileText;
  items: string[];
  compact?: boolean;
}) {
  return (
    <section className="premium-card p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-4 grid gap-2">
        {items.length ? (
          items.slice(0, compact ? 4 : 8).map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        )}
      </div>
    </section>
  );
}

function Placeholder({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="premium-card border-dashed p-4">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium">{title} Placeholder</p>
      <p className="mt-1 text-xs text-muted-foreground">Prepared for a later connected module.</p>
    </div>
  );
}
