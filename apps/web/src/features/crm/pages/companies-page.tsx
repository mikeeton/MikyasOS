import { useQuery } from '@tanstack/react-query';
import { Grid2X2, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { crmApi, type Company } from '@/api/client';
import { Button } from '@/components/ui/button';
import { CrmFilters } from '../components/crm-filters';
import { formatDate, formatMoney, initials } from '../components/crm-format';
import { CrmEmptyState, CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

const companyStatuses = [
  'PROSPECT',
  'ACTIVE',
  'INACTIVE',
  'CUSTOMER',
  'PARTNER',
  'SUPPLIER',
  'ARCHIVED',
];

export function CompaniesPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const companies = useQuery({
    queryKey: ['crm', 'companies', organisationId, search, status],
    queryFn: () => crmApi.companies(token!, organisationId!, { search, status, pageSize: 25 }),
    enabled,
  });

  return (
    <CrmShell
      title="Companies"
      description="Manage customer organisations with revenue, tags, contacts, recent activity, and ownership context."
      actions={
        <Button asChild>
          <Link to="/app/crm/companies/new">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create Company
          </Link>
        </Button>
      }
    >
      <CrmFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statuses={companyStatuses}
        viewToggle={
          <div className="flex rounded-md border border-border p-1">
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
            >
              <List className="mr-2 size-4" /> Table
            </Button>
            <Button
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('cards')}
            >
              <Grid2X2 className="mr-2 size-4" /> Cards
            </Button>
          </div>
        }
      />
      {companies.isLoading ? (
        <CrmSkeleton rows={7} />
      ) : companies.isError ? (
        <CrmErrorState onRetry={() => void companies.refetch()} />
      ) : companies.data?.items.length === 0 ? (
        <CrmEmptyState
          title="No companies found"
          description="Create a company or clear filters to see customer accounts here."
          actionLabel="Create company"
          actionTo="/app/crm/companies/new"
        />
      ) : view === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.data?.items.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden premium-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm text-muted-foreground">
            <span>{companies.data?.pagination.total ?? 0} companies</span>
            <span>Bulk actions and column presets prepared</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="sticky top-0 bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input aria-label="Select all companies" type="checkbox" />
                  </th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {companies.data?.items.map((company) => (
                  <tr key={company.id} className="premium-row">
                    <td className="px-4 py-3">
                      <input aria-label={`Select ${company.name}`} type="checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/app/crm/companies/${company.id}`}
                        className="flex items-center gap-3 font-medium"
                      >
                        <span className="grid size-9 place-items-center rounded-md bg-muted text-xs">
                          {initials(company.name)}
                        </span>
                        <span>
                          <span className="block">{company.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {company.email ?? company.website ?? 'No primary contact'}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">{company.industry ?? '—'}</td>
                    <td className="px-4 py-3">{company.country ?? '—'}</td>
                    <td className="px-4 py-3">{formatMoney(company.annualRevenue)}</td>
                    <td className="px-4 py-3">{company.status}</td>
                    <td className="px-4 py-3">
                      {company.tags?.map(({ tag }) => tag.name).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3">{formatDate(company.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CrmShell>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      to={`/app/crm/companies/${company.id}`}
      className="premium-card p-5 transition hover:border-foreground/20 hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-muted text-sm font-semibold">
          {initials(company.name)}
        </span>
        <span className="rounded bg-muted px-2 py-1 text-xs">{company.status}</span>
      </div>
      <h3 className="mt-4 font-semibold">{company.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {company.industry ?? 'No industry'} · {company.country ?? 'No country'}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <span>
          <span className="block text-xs text-muted-foreground">Revenue</span>
          {formatMoney(company.annualRevenue)}
        </span>
        <span>
          <span className="block text-xs text-muted-foreground">Contacts</span>
          {company._count?.contacts ?? 0}
        </span>
      </div>
    </Link>
  );
}
