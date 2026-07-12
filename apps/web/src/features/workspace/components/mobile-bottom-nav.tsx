import { CalendarDays, Gauge, Plus, Search, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { cn } from '@/lib/utils';

const mobileItems = [
  { label: 'Home', to: '/app', icon: Gauge },
  { label: 'Today', to: '/app/today', icon: Target },
  { label: 'Search', to: '/app/crm/search', icon: Search },
  { label: 'Calendar', to: '/app/calendar', icon: CalendarDays },
  { label: 'Create', to: '/app/projects/new', icon: Plus },
] as const;

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="premium-glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-lg p-1.5 shadow-2xl lg:hidden">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const active =
          item.to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.label}
            to={item.to}
            className={cn(
              'premium-focus relative grid min-h-12 place-items-center rounded-md px-1 py-1 text-[11px] text-muted-foreground transition',
              active && 'bg-foreground text-background shadow-lg',
            )}
          >
            {active && (
              <span
                className="absolute -top-1 h-1 w-6 rounded-full bg-current opacity-70"
                aria-hidden="true"
              />
            )}
            <Icon className="mb-0.5 size-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
