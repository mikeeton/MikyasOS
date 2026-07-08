import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Receipt, Search, UsersRound } from 'lucide-react';
import { useState } from 'react';

const futureSearchGroups = [
  { title: 'Customers', icon: UsersRound },
  { title: 'Projects', icon: FileText },
  { title: 'Tasks', icon: FileText },
  { title: 'Documents', icon: FileText },
  { title: 'Employees', icon: UsersRound },
  { title: 'Invoices', icon: Receipt },
  { title: 'AI Memory', icon: Search },
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
            className="mx-auto w-full max-w-xl overflow-hidden rounded-md border border-border bg-background shadow-2xl"
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
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">Search surfaces prepared</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Business data search will connect after the corresponding modules are built.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {futureSearchGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                      {group.title}
                    </div>
                  );
                })}
              </div>
              {query && (
                <div className="mt-4 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                  No live results yet for "{query}". The interface is ready for indexed workspace
                  data.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
