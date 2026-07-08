import { Outlet } from 'react-router';

import { WorkspaceProvider } from '@/features/workspace/context/workspace-context';
import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';
import { WorkspaceTopbar } from '@/features/workspace/components/workspace-topbar';

export function WorkspaceShell() {
  return (
    <WorkspaceProvider>
      <div className="premium-app-bg min-h-screen text-foreground lg:grid lg:grid-cols-[auto_1fr]">
        <WorkspaceSidebar />
        <div className="min-w-0">
          <WorkspaceTopbar />
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
