import { Activity } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r border-border bg-muted/35 p-10 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="size-5" />
          </div>
          <span className="font-semibold">mikyasOS</span>
        </Link>
        <div className="max-w-md">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Identity Platform
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Secure access for every business workspace.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Accounts, organisations, roles, sessions, and invitations are wired for the modules that
            come next.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
