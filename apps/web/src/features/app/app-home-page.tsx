import { useQuery } from '@tanstack/react-query';

import { identityApi } from '@/api/client';
import { useAuthStore } from '@/stores/auth-store';

export function AppHomePage() {
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const organisations = useQuery({
    queryKey: ['organisations'],
    queryFn: () => identityApi.organisations(token!),
    enabled: Boolean(token),
  });

  return (
    <section className="max-w-4xl">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Protected workspace
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome, {user?.name}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        This is the permanent authenticated shell. Business modules will attach here in later
        milestones.
      </p>
      <div className="mt-8 grid gap-3">
        {organisations.data?.map((organisation) => (
          <div key={organisation.id} className="rounded-md border border-border p-4">
            <p className="font-medium">{organisation.name}</p>
            <p className="text-sm text-muted-foreground">{organisation.slug}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
