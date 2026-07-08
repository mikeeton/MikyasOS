import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { crmApi } from '@/api/client';
import { CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

export function CrmSearchPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [query, setQuery] = useState('');
  const results = useQuery({
    queryKey: ['crm', 'search', organisationId, query],
    queryFn: () => crmApi.search(token!, organisationId!, query),
    enabled: enabled && query.trim().length > 0,
  });

  return (
    <CrmShell
      title="Customer Search"
      description="Search companies, contacts, leads, opportunities, notes, tags, and future AI results from one place."
    >
      <div className="premium-card p-4">
        <label className="flex h-12 items-center gap-3 rounded-md border border-input px-3">
          <Search className="size-5 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search CRM</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
            placeholder="Search Acme, ada@example.com, London, VIP..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-2 py-1">Recent: Acme</span>
          <span className="rounded bg-muted px-2 py-1">Saved searches prepared</span>
          <span className="rounded bg-muted px-2 py-1">Keyboard navigation prepared</span>
        </div>
      </div>
      {results.isLoading ? (
        <CrmSkeleton rows={5} />
      ) : query && results.data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <SearchGroup
            title="Companies"
            items={results.data.results.companies.map((item) => ({
              label: item.name,
              href: `/app/crm/companies/${item.id}`,
            }))}
          />
          <SearchGroup
            title="Contacts"
            items={results.data.results.contacts.map((item) => ({
              label: `${item.firstName} ${item.lastName}`,
              href: `/app/crm/contacts/${item.id}`,
            }))}
          />
          <SearchGroup
            title="Leads"
            items={results.data.results.leads.map((item) => ({
              label: `${item.company?.name ?? 'Lead'} · ${item.status}`,
              href: '/app/crm/leads',
            }))}
          />
          <SearchGroup
            title="Opportunities"
            items={results.data.results.opportunities.map((item) => ({
              label: `${item.company?.name ?? 'Opportunity'} · ${item.status}`,
              href: '/app/crm/opportunities',
            }))}
          />
          <SearchGroup
            title="Tags"
            items={results.data.results.tags.map((item) => ({
              label: item.name,
              href: '/app/crm/companies',
            }))}
          />
          <SearchGroup
            title="Future AI Results"
            items={[
              { label: 'AI customer memory will appear here later.', href: '/app/crm/search' },
            ]}
          />
        </div>
      ) : (
        <div className="premium-card border-dashed p-8 text-center text-sm text-muted-foreground">
          Search across CRM data. Results highlight matching customers, people, deals, and future AI
          memory.
        </div>
      )}
    </CrmShell>
  );
}

function SearchGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <section className="premium-card p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.length ? (
          items.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.href}
              className="rounded-md border border-border px-3 py-2 text-sm transition hover:bg-accent"
            >
              {item.label}
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No matches.</p>
        )}
      </div>
    </section>
  );
}
