import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Clock, Search, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { cn } from '@/lib/utils';

import { quickActions, recentPages, workspaceNavigation } from '../config/navigation';
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';
import { cascadeContainer, cascadeItem, premiumSpring } from '../motion/premium-motion';

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut(
    (event) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k',
    (event) => {
      event.preventDefault();
      onOpenChange(!open);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    },
  );

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const commandItems = [...workspaceNavigation, ...quickActions];

    if (!normalizedQuery) {
      return commandItems.slice(0, 8);
    }

    return commandItems.filter((item) =>
      [item.title, item.route, ...item.keywords].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query]);

  const runCommand = (route: string, disabled?: boolean) => {
    if (disabled) {
      return;
    }

    onOpenChange(false);
    setQuery('');
    void navigate(route);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-start bg-background/72 px-4 pt-20 backdrop-blur-md sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="premium-glass mx-auto w-full max-w-2xl overflow-hidden rounded-md"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={premiumSpring}
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
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="Search pages, actions, and navigation..."
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                Esc
              </kbd>
            </div>
            <div className="max-h-[28rem] overflow-y-auto p-2">
              <div className="mb-2 rounded-md border border-border/70 bg-background/50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="size-3.5" aria-hidden="true" />
                  Type a module, action, or route. Keyboard-first workflows stay under one command.
                </div>
              </div>
              <motion.div variants={cascadeContainer} initial="initial" animate="animate">
                <CommandSection title={query ? 'Results' : 'Quick actions'} icon={Sparkles}>
                  {results.length > 0 ? (
                    results.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={`${item.title}-${item.route}`}
                          type="button"
                          className={cn(
                            'premium-interactive flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm hover:bg-accent',
                            item.disabled && 'cursor-not-allowed opacity-55',
                          )}
                          variants={cascadeItem}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => runCommand(item.route, item.disabled)}
                        >
                          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{item.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {item.disabled ? 'Coming soon' : item.route}
                            </span>
                          </span>
                          {item.badge && (
                            <span className="status-pill status-pill-info px-2 py-0.5 text-[10px]">
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="rounded-md border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
                      No command matches "{query}". Try a module name like CRM, Projects, AI, or
                      Billing.
                    </div>
                  )}
                </CommandSection>
              </motion.div>
              {!query && (
                <>
                  <CommandSection title="Recent pages" icon={Clock}>
                    {recentPages.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={`recent-${item.route}`}
                          type="button"
                          className="premium-interactive flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => runCommand(item.route, item.disabled)}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {item.title}
                        </button>
                      );
                    })}
                  </CommandSection>
                  <CommandSection title="AI placeholder" icon={Bot}>
                    <div className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                      AI command routing will connect after business modules exist.
                    </div>
                  </CommandSection>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommandSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="mb-3 last:mb-0">
      <h2 className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
      </h2>
      <div className="grid gap-1">{children}</div>
    </section>
  );
}
