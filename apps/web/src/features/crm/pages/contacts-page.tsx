import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { crmApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { CrmFilters } from '../components/crm-filters';
import { formatDate, initials } from '../components/crm-format';
import { CrmEmptyState, CrmErrorState, CrmShell, CrmSkeleton } from '../components/crm-shell';
import { useCrmContext } from '../hooks/use-crm-context';

export function ContactsPage() {
  const { token, organisationId, enabled } = useCrmContext();
  const [search, setSearch] = useState('');
  const contacts = useQuery({
    queryKey: ['crm', 'contacts', organisationId, search],
    queryFn: () => crmApi.contacts(token!, organisationId!, { search, pageSize: 25 }),
    enabled,
  });

  return (
    <CrmShell
      title="Contacts"
      description="People, roles, communication details, relationship notes, and the next best customer action."
      actions={
        <Button asChild>
          <Link to="/app/crm/contacts/new">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create Contact
          </Link>
        </Button>
      }
    >
      <CrmFilters
        search={search}
        onSearchChange={setSearch}
        status=""
        onStatusChange={() => undefined}
        statuses={[]}
      />
      {contacts.isLoading ? (
        <CrmSkeleton rows={7} />
      ) : contacts.isError ? (
        <CrmErrorState onRetry={() => void contacts.refetch()} />
      ) : contacts.data?.items.length === 0 ? (
        <CrmEmptyState
          title="No contacts found"
          description="Add people to customer companies so every relationship has a clear owner and context."
          actionLabel="Create contact"
          actionTo="/app/crm/contacts/new"
        />
      ) : (
        <div className="overflow-hidden premium-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input aria-label="Select all contacts" type="checkbox" />
                  </th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {contacts.data?.items.map((contact) => (
                  <tr key={contact.id} className="premium-row">
                    <td className="px-4 py-3">
                      <input
                        aria-label={`Select ${contact.firstName} ${contact.lastName}`}
                        type="checkbox"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/app/crm/contacts/${contact.id}`}
                        className="flex items-center gap-3 font-medium"
                      >
                        <span className="grid size-9 place-items-center rounded-full bg-muted text-xs">
                          {initials(`${contact.firstName} ${contact.lastName}`)}
                        </span>
                        <span>
                          {contact.firstName} {contact.lastName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">{contact.jobTitle ?? '—'}</td>
                    <td className="px-4 py-3">{contact.company?.name ?? '—'}</td>
                    <td className="px-4 py-3">{contact.email ?? '—'}</td>
                    <td className="px-4 py-3">{contact.phone ?? contact.mobile ?? '—'}</td>
                    <td className="px-4 py-3">{formatDate(contact.updatedAt)}</td>
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
