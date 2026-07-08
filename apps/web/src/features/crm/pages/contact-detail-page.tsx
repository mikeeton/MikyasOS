import { useQuery } from '@tanstack/react-query';
import { BriefcaseBusiness, Cake, Edit, FileText, Linkedin, Mail, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { AiPlaceholder } from '../components/ai-placeholder';
import { formatDate, initials } from '../components/crm-format';
import { CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

export function ContactDetailPage() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useCrmContext();
  const contact = useQuery({
    queryKey: ['crm', 'contact', organisationId, id],
    queryFn: () => crmApi.contact(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });

  if (contact.isLoading) return <CrmSkeleton rows={7} />;
  if (contact.isError || !contact.data)
    return <CrmErrorState onRetry={() => void contact.refetch()} />;

  const item = contact.data;
  const fullName = `${item.firstName} ${item.lastName}`;

  return (
    <CrmShell
      title={fullName}
      description="A complete human relationship profile with context, communication, activity, files, and future AI summary."
      actions={
        <Button asChild>
          <Link to={`/app/crm/contacts/${item.id}/edit`}>
            <Edit className="mr-2 size-4" aria-hidden="true" />
            Edit contact
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <aside className="premium-card p-5">
          <div className="grid size-16 place-items-center rounded-full bg-muted text-lg font-semibold">
            {initials(fullName)}
          </div>
          <h3 className="mt-4 font-semibold">{fullName}</h3>
          <p className="text-sm text-muted-foreground">{item.jobTitle ?? 'No position set'}</p>
          <div className="mt-5 grid gap-3 text-sm">
            <ContactFact icon={BriefcaseBusiness} value={item.company?.name ?? 'No company'} />
            <ContactFact icon={Mail} value={item.email ?? 'No email'} />
            <ContactFact icon={Phone} value={item.phone ?? item.mobile ?? 'No phone'} />
            <ContactFact icon={Linkedin} value={item.linkedin ?? 'No LinkedIn'} />
            <ContactFact icon={Cake} value={formatDate(item.birthday)} />
          </div>
        </aside>
        <div className="grid gap-6">
          <section className="premium-card p-5">
            <h3 className="font-semibold">Notes</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.notes ?? 'No notes yet.'}
            </p>
          </section>
          <section className="premium-card p-5">
            <h3 className="font-semibold">Activity Timeline</h3>
            <div className="mt-4 grid gap-3">
              {item.activities?.length ? (
                item.activities.map((activity) => (
                  <div key={activity.id} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type} · {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
          </section>
          <div className="grid gap-4 md:grid-cols-3">
            <Placeholder icon={FileText} title="Files" />
            <Placeholder icon={BriefcaseBusiness} title="Related Opportunities" />
            <AiPlaceholder kind="customerSummary" compact />
          </div>
        </div>
      </div>
    </CrmShell>
  );
}

function ContactFact({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0 truncate">{value}</span>
    </div>
  );
}

function Placeholder({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="premium-card border-dashed p-5">
      <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">Prepared for the next CRM expansion.</p>
    </div>
  );
}
