import { motion } from 'framer-motion';
import { Command, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';

import { Button } from '@/components/ui/button';

import { workspaceNavigation } from '../config/navigation';
import { CommandPalette } from './command-palette';
import { NotificationCentre } from './notification-centre';
import { OrganisationSwitcher } from './organisation-switcher';
import { QuickCreateMenu } from './quick-create-menu';
import { SearchModal } from './search-modal';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';
import { useWorkspace } from '../hooks/use-workspace';

export function WorkspaceTopbar() {
  const location = useLocation();
  const { currentOrganisation } = useWorkspace();
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentPage = useMemo(() => {
    const exact = workspaceNavigation.find((item) => item.route === location.pathname);
    const section = workspaceNavigation.find(
      (item) => item.route !== '/app' && location.pathname.startsWith(item.route),
    );
    return exact ?? section ?? workspaceNavigation[0];
  }, [location.pathname]);

  return (
    <>
      <header className="premium-surface sticky top-0 z-20 border-b bg-background/78 supports-[backdrop-filter]:bg-background/72">
        <div className="flex min-h-16 items-center gap-3 px-4 pl-20 sm:px-6 lg:pl-6">
          <div className="min-w-0 flex-1">
            <motion.div
              key={`${currentOrganisation?.id ?? 'org'}-${currentPage?.route ?? 'page'}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="hidden sm:inline">Workspace</span>
              <span className="sm:hidden">Space</span>
              <span aria-hidden="true">/</span>
              <span className="truncate">{currentOrganisation?.name ?? 'Organisation'}</span>
            </motion.div>
            <h1 className="truncate text-lg font-semibold tracking-tight">{currentPage?.title}</h1>
          </div>
          <button
            type="button"
            className="premium-interactive hidden h-9 min-w-0 flex-1 max-w-xl items-center gap-2 rounded-md border border-input bg-background/70 px-3 text-left text-sm text-muted-foreground hover:max-w-2xl hover:bg-accent md:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Search workspace...</span>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden gap-2 bg-background/72 px-3 backdrop-blur xl:inline-flex"
              onClick={() => setCommandOpen(true)}
            >
              <Command className="size-4" aria-hidden="true" />
              Command
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/72 backdrop-blur md:hidden"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>
            <div className="hidden xl:block">
              <OrganisationSwitcher />
            </div>
            <QuickCreateMenu />
            <ThemeToggle />
            <NotificationCentre />
            <UserMenu />
          </div>
        </div>
      </header>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
