import { Building2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useWorkspace } from '../hooks/use-workspace';

export function OrganisationSwitcher({ compact = false }: { compact?: boolean }) {
  const {
    currentOrganisation,
    organisations,
    isLoadingOrganisations,
    isSwitchingOrganisation,
    switchOrganisation,
  } = useWorkspace();

  return (
    <div className={cn('flex items-center gap-2', compact && 'w-full')}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
        {isSwitchingOrganisation ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
        ) : (
          <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <label className="sr-only" htmlFor="organisation-switcher">
        Current organisation
      </label>
      <select
        id="organisation-switcher"
        className={cn(
          'h-9 min-w-0 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring',
          compact ? 'w-full' : 'w-44',
        )}
        value={currentOrganisation?.id ?? ''}
        onChange={(event) => switchOrganisation(event.target.value)}
        disabled={isLoadingOrganisations || isSwitchingOrganisation}
      >
        <option value="" disabled>
          {isLoadingOrganisations ? 'Loading...' : 'Select organisation'}
        </option>
        {organisations.map((organisation) => (
          <option key={organisation.id} value={organisation.id}>
            {organisation.name}
          </option>
        ))}
      </select>
    </div>
  );
}
