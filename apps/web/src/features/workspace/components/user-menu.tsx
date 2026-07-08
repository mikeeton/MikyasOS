import { Keyboard, LogOut, Settings, UserRound, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import { identityApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

import { useWorkspace } from '../hooks/use-workspace';
import { ThemeToggle } from './theme-toggle';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { currentUser } = useWorkspace();
  const logout = useMutation({
    mutationFn: () => identityApi.logout(accessToken!),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      void navigate('/login');
    },
  });

  const initials =
    currentUser?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MO';

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2 px-2"
        aria-label="Open user menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid size-6 place-items-center rounded bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{currentUser?.name ?? 'Account'}</span>
      </Button>
      {open && (
        <div className="absolute right-0 z-40 mt-3 w-72 rounded-md border border-border bg-background p-2 shadow-xl">
          <div className="px-3 py-3">
            <p className="truncate text-sm font-semibold">{currentUser?.name ?? 'mikyasOS user'}</p>
            <p className="truncate text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
          <div className="border-t border-border py-2">
            <MenuLink icon={UserRound} label="Profile" to="/app/settings" />
            <MenuLink icon={Settings} label="Account Settings" to="/app/settings" />
            <MenuLink icon={UsersRound} label="Organisation Settings" to="/app/settings" />
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Keyboard className="size-4" aria-hidden="true" />
              Keyboard Shortcuts
            </button>
          </div>
          <div className="border-t border-border py-3">
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">Theme</p>
            <ThemeToggle compact />
          </div>
          <div className="border-t border-border pt-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof UserRound;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
