import { useQuery } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  ChartNoAxesCombined,
  ContactRound,
  FileSearch,
  Plus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { AiPlaceholder } from '../components/ai-placeholder';
import {
  CrmEmptyState,
  CrmErrorState,
  CrmShell,
  CrmSkeleton,
  CrmStat,
} from '../components/crm-shell';
import { formatMoney } from '../components/crm-format';
import { useCrmContext } from '../hooks/use-crm-context';

export function CrmDashboardPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const companies = useQuery({
    queryKey: ['crm', 'companies', organisationId, 'dashboard'],
    queryFn: () => crmApi.companies(token!, organisationId!, { pageSize: 8 }),
    enabled,
  });
  const leads = useQuery({
    queryKey: ['crm', 'leads', organisationId, 'dashboard'],
    queryFn: () => crmApi.leads(token!, organisationId!, { pageSize: 50 }),
    enabled,
  });
  const opportunities = useQuery({
    queryKey: ['crm', 'opportunities', organisationId, 'dashboard'],
    queryFn: () => crmApi.opportunities(token!, organisationId!, { pageSize: 50 }),
    enabled,
  });

  const isLoading = companies.isLoading || leads.isLoading || opportunities.isLoading;
  const isError = companies.isError || leads.isError || opportunities.isError;
  const companyItems = companies.data?.items ?? [];
  const leadItems = leads.data?.items ?? [];
  const opportunityItems = opportunities.data?.items ?? [];
  const openOpportunities = opportunityItems.filter((item) => item.status === 'OPEN');
  const pipelineValue = openOpportunities.reduce(
    (total, item) => total + Number(item.estimatedRevenue ?? 0),
    0,
  );
  const qualifiedLeads = leadItems.filter((item) => item.status === 'QUALIFIED').length;

  return (
    <CrmShell
      title="Customer command centre"
      description="Understand what happened, what needs attention, what to do next, and where AI will help once intelligence is connected."
      actions={
        <>
          <Button asChild>
            <Link to="/app/crm/companies/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Create Company
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/crm/search">
              <Search className="mr-2 size-4" aria-hidden="true" />
              Search CRM
            </Link>
          </Button>
        </>
      }
    >
      {isLoading ? (
        <CrmSkeleton rows={6} />
      ) : isError ? (
        <CrmErrorState
          onRetry={() => {
            void companies.refetch();
            void leads.refetch();
            void opportunities.refetch();
          }}
        />
      ) : companies.data?.pagination.total === 0 ? (
        <CrmEmptyState
          title="Start with your first customer"
          description="Create a company to unlock contacts, leads, opportunities, notes, files, tags, and timelines."
          actionLabel="Create company"
          actionTo="/app/crm/companies/new"
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CrmStat
              label="Total Customers"
              value={companies.data?.pagination.total ?? 0}
              hint="Companies in this organisation"
            />
            <CrmStat
              label="Active Companies"
              value={
                companyItems.filter(
                  (item) => item.status === 'ACTIVE' || item.status === 'CUSTOMER',
                ).length
              }
              hint="Customers and active accounts"
              tone="success"
            />
            <CrmStat
              label="New Leads"
              value={leadItems.filter((item) => item.status === 'NEW').length}
              hint="Need first response"
              tone="warning"
            />
            <CrmStat
              label="Qualified Leads"
              value={qualifiedLeads}
              hint="Ready for pipeline review"
            />
            <CrmStat
              label="Open Opportunities"
              value={openOpportunities.length}
              hint="Deals in motion"
            />
            <CrmStat
              label="Pipeline Value"
              value={formatMoney(pipelineValue)}
              hint="Expected open revenue"
              tone="success"
            />
            <CrmStat
              label="Monthly Revenue Forecast"
              value={formatMoney(pipelineValue * 0.28)}
              hint="Placeholder forecast model"
            />
            <CrmStat
              label="Conversion Rate"
              value={`${leadItems.length ? Math.round((qualifiedLeads / leadItems.length) * 100) : 0}%`}
              hint="Lead quality signal"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <section className="premium-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Recent Customers</h3>
                  <p className="text-sm text-muted-foreground">
                    Fresh accounts that may need follow-up.
                  </p>
                </div>
                <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-3">
                {companyItems.slice(0, 5).map((company) => (
                  <Link
                    key={company.id}
                    to={`/app/crm/companies/${company.id}`}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-3 transition hover:bg-accent"
                  >
                    <span>
                      <span className="block text-sm font-medium">{company.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {company.industry ?? 'No industry'} · {company.country ?? 'No country'}
                      </span>
                    </span>
                    <span className="text-xs font-medium">{company.status}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <InfoCard
                icon={TrendingUp}
                title="Customer Growth"
                text="Growth trends will become richer when historical imports arrive."
              />
              <AiPlaceholder kind="salesCoach" />
              <AiPlaceholder kind="riskDetection" />
              <InfoCard
                icon={ChartNoAxesCombined}
                title="Business Health"
                text="Pipeline, lead quality, and customer engagement are ready to feed health scoring."
              />
            </section>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <QuickAction icon={Building2} label="Create Company" to="/app/crm/companies/new" />
            <QuickAction icon={ContactRound} label="Create Contact" to="/app/crm/contacts/new" />
            <QuickAction icon={FileSearch} label="Search CRM" to="/app/crm/search" />
            <QuickAction icon={ChartNoAxesCombined} label="Open Pipeline" to="/app/crm/pipeline" />
          </section>
        </>
      )}
    </CrmShell>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="premium-card p-5">
      <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }: { icon: LucideIcon; label: string; to: string }) {
  return (
    <Button asChild variant="outline" className="h-16 justify-start gap-3">
      <Link to={to}>
        <Icon className="size-5" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
