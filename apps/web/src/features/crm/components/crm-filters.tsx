import { Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CrmFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statuses,
  viewToggle,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statuses: string[];
  viewToggle?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-3 lg:flex-row lg:items-center">
      <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-input px-3 text-sm">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Search CRM records</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, email, country, city, tag..."
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
      <Button variant="outline">
        <SlidersHorizontal className="mr-2 size-4" aria-hidden="true" />
        Save filter
      </Button>
      {viewToggle}
    </div>
  );
}
