import { Navigate, Outlet } from 'react-router';

import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';
import { WorkspaceTopbar } from '@/features/workspace/components/workspace-topbar';
import { WorkspaceProvider } from '@/features/workspace/context/workspace-context';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';

export function WorkspaceShell() {
  return (
    <WorkspaceProvider>
      <WorkspaceFrame />
    </WorkspaceProvider>
  );
}

function WorkspaceFrame() {
  const { currentOrganisation, isLoadingOrganisations } = useWorkspace();

  if (isLoadingOrganisations) {
    return (
      <div className="premium-app-bg grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (!currentOrganisation) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="premium-app-bg min-h-screen text-foreground lg:grid lg:grid-cols-[auto_1fr]">
      <WorkspaceSidebar />
      <div className="min-w-0">
        <WorkspaceTopbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
