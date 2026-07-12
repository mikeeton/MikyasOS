import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, FileText, Receipt, Search, Sparkles, UsersRound } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const futureSearchGroups = [
  { title: 'Customers', icon: UsersRound },
  { title: 'Projects', icon: FileText },
  { title: 'Tasks', icon: FileText },
  { title: 'Documents', icon: FileText },
  { title: 'Employees', icon: UsersRound },
  { title: 'Invoices', icon: Receipt },
  { title: 'AI Memory', icon: Search },
];

const suggestedSearches = [
  'Blocked projects',
  'Recent invoices',
  'Customer onboarding',
  'Security audit',
];

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState('');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-start bg-background/75 px-4 pt-20 backdrop-blur-sm sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="premium-glass mx-auto w-full max-w-2xl overflow-hidden rounded-md"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onOpenChange(false);
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="Search customers, projects, tasks, documents..."
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline">
                Enter
              </kbd>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Search the operating system</p>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    The interface is ready for indexed records, semantic retrieval, and AI answers
                    across every business module.
                  </p>
                </div>
                <span className="status-pill status-pill-info w-fit">Index ready</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedSearches.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="premium-interactive rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {futureSearchGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className="premium-muted-panel flex items-center gap-3 px-3 py-2 text-sm"
                    >
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                      {group.title}
                    </div>
                  );
                })}
              </div>
              {query && (
                <div className="mt-4 rounded-md border border-dashed border-border bg-background/60 px-3 py-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">No live results yet for "{query}"</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Once records are indexed, this panel can show previews, filters, citations,
                        and direct actions without leaving your workflow.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setQuery('')}>
                      Clear search
                    </Button>
                    <Button size="sm" variant="ghost" disabled>
                      Preview unavailable
                      <ArrowUpRight className="ml-2 size-3" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
