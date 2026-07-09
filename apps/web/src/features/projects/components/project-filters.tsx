import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

export function ProjectFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  viewToggle,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  viewToggle?: ReactNode;
}) {
  return (
    <div className="premium-card grid gap-3 p-3 lg:grid-cols-[1fr_auto_auto_auto]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="premium-input pl-9"
          placeholder="Search projects, tasks, assignees..."
          aria-label="Search projects"
        />
      </label>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="premium-input lg:w-44"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        className="premium-input lg:w-44"
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {viewToggle}
    </div>
  );
}
