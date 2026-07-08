import { Building2, Keyboard, Palette, ShieldCheck } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';
import { useWorkspace } from '../hooks/use-workspace';

export function WorkspaceSettingsPage() {
  const { currentOrganisation, permissions, featureFlags, aiStatus } = useWorkspace();
  const enabledFlags = Object.values(featureFlags).filter(Boolean).length;

  return (
    <section className="mx-auto grid max-w-5xl gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Workspace settings</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Shell preferences</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          This page keeps permanent workspace controls available while deeper account, organisation,
          and billing settings wait for a later milestone.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-md border border-border bg-background p-5">
          <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Current organisation</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentOrganisation?.name ?? 'No organisation selected'}
          </p>
        </section>
        <section className="rounded-md border border-border bg-background p-5">
          <Palette className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Theme</h3>
          <div className="mt-4">
            <ThemeToggle compact />
          </div>
        </section>
        <section className="rounded-md border border-border bg-background p-5">
          <ShieldCheck className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Workspace context</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {permissions.length} base permission, {enabledFlags} feature flags enabled, AI status:
            {` ${aiStatus}`}.
          </p>
        </section>
        <section className="rounded-md border border-border bg-background p-5">
          <Keyboard className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Keyboard shortcuts</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Use Ctrl+K or Command+K to open the command palette from anywhere in the authenticated
            workspace.
          </p>
        </section>
      </div>
    </section>
  );
}
