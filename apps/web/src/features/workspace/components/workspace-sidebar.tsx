import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { workspaceNavigation } from '../config/navigation';
import { premiumSpring } from '../motion/premium-motion';
import { OrganisationSwitcher } from './organisation-switcher';

export function WorkspaceSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-3 z-30 bg-background/88 shadow-lg backdrop-blur-xl lg:hidden"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-4" aria-hidden="true" />
      </Button>
      <motion.aside
        animate={{ width: collapsed ? 76 : 272 }}
        transition={reduceMotion ? { duration: 0 } : premiumSpring}
        className={cn(
          'premium-surface relative z-20 hidden min-h-screen border-r bg-background/94 lg:sticky lg:top-0 lg:block',
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
      </motion.aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="premium-glass fixed inset-y-0 left-0 z-50 w-[min(20rem,86vw)] border-r lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={premiumSpring}
            >
              <SidebarContent
                collapsed={false}
                onCloseMobile={() => setMobileOpen(false)}
                onToggleCollapsed={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapsed,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile?: () => void;
}) {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col px-3 py-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <Link
          to="/app"
          className={cn(
            'premium-focus flex min-w-0 items-center gap-3 rounded-md px-1 py-1',
            collapsed && 'px-0',
          )}
          onClick={onCloseMobile}
        >
          <span className="ai-breathing grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-[0_14px_34px_hsl(var(--primary)/0.2)]">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">mikyasOS</span>
              <span className="block truncate text-xs text-muted-foreground">Workspace</span>
            </span>
          )}
        </Link>
        {onCloseMobile ? (
          <Button variant="ghost" size="icon" aria-label="Close sidebar" onClick={onCloseMobile}>
            <X className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapsed}
          >
            {collapsed ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      {!collapsed && (
        <div className="mt-5">
          <OrganisationSwitcher compact />
        </div>
      )}
      <nav className="mt-6 grid gap-1" aria-label="Workspace navigation">
        {workspaceNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.route === '/app'
              ? location.pathname === '/app'
              : location.pathname.startsWith(item.route);

          if (item.disabled) {
            return (
              <motion.button
                key={item.title}
                type="button"
                className={cn(
                  'premium-interactive group flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground',
                  collapsed && 'justify-center px-0',
                )}
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`${item.title} coming soon`}
                title={collapsed ? `${item.title} coming soon` : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            );
          }

          return (
            <NavLink
              key={item.title}
              to={item.route}
              end={item.route === '/app'}
              onClick={onCloseMobile}
              className={({ isActive: routerActive }) =>
                cn(
                  'premium-interactive group relative flex h-10 items-center gap-3 overflow-hidden rounded-md px-3 text-sm hover:bg-accent/80 hover:text-foreground',
                  collapsed && 'justify-center px-0',
                  (routerActive || isActive) &&
                    'border border-foreground/10 bg-foreground/[0.055] text-foreground shadow-sm',
                  !(routerActive || isActive) && 'text-muted-foreground',
                )
              }
              aria-label={item.title}
              title={collapsed ? item.title : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="workspace-active-indicator"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.28)]"
                  transition={premiumSpring}
                />
              )}
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="premium-card mt-auto p-3">
        {collapsed ? (
          <Sparkles className="mx-auto size-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium">Today focus</p>
              <span className="status-pill status-pill-info px-2 py-0.5 text-[10px]">Live</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Open your command centre for meetings, due work, follow-ups, and next actions.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
