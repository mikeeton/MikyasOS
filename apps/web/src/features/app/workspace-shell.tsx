import { useQuery, useMutation } from '@tanstack/react-query';
import { Bell, LogOut, Search, Settings, Sparkles } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router';

import { identityApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

export function WorkspaceShell() {
  const navigate = useNavigate();
  const { accessToken, user, clearAuth, setAuth } = useAuthStore();
  const organisations = useQuery({
    queryKey: ['organisations'],
    queryFn: () => identityApi.organisations(accessToken!),
    enabled: Boolean(accessToken),
  });
  const logout = useMutation({
    mutationFn: () => identityApi.logout(accessToken!),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      void navigate('/login');
    },
  });
  const switchOrganisation = useMutation({
    mutationFn: (organisationId: string) =>
      identityApi.switchOrganisation(accessToken!, organisationId),
    onSuccess: (response) => {
      setAuth(response);
      void queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });

  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-border bg-muted/30 px-4 py-5">
        <Link to="/app" className="flex items-center gap-3 px-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">mikyasOS</p>
            <p className="text-xs text-muted-foreground">Workspace</p>
          </div>
        </Link>
        <nav className="mt-8 grid gap-1 text-sm">
          <Link className="rounded-md px-3 py-2 font-medium hover:bg-accent" to="/app">
            Home
          </Link>
          <Link
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent"
            to="/app/settings"
          >
            Settings
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="hidden h-9 w-full max-w-md items-center gap-2 rounded-md border border-input px-3 text-sm text-muted-foreground sm:flex">
              <Search className="size-4" />
              Search will connect to modules later
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={user?.activeOrganisationId ?? ''}
              onChange={(event) => switchOrganisation.mutate(event.target.value)}
            >
              <option value="" disabled>
                Select organisation
              </option>
              {organisations.data?.map((organisation) => (
                <option key={organisation.id} value={organisation.id}>
                  {organisation.name}
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
            <Button variant="outline" onClick={() => logout.mutate()}>
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
