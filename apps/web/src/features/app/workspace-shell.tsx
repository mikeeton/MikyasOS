import { motion, useReducedMotion } from 'framer-motion';
import { Navigate, Outlet, useLocation } from 'react-router';

import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';
import { WorkspaceTopbar } from '@/features/workspace/components/workspace-topbar';
import { MobileBottomNav } from '@/features/workspace/components/mobile-bottom-nav';
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
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  if (isLoadingOrganisations) {
    return (
      <div className="premium-app-bg grid min-h-screen place-items-center px-6 text-center text-sm text-muted-foreground">
        <div className="premium-section w-full max-w-sm p-6">
          <div className="premium-shimmer mx-auto h-10 w-10 rounded-md" />
          <p className="mt-4 font-medium text-foreground">Preparing your workspace</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Loading organisation context and secure session details.
          </p>
        </div>
      </div>
    );
  }

  if (!currentOrganisation) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="premium-app-bg min-h-screen text-foreground lg:grid lg:grid-cols-[auto_1fr]">
      <a href="#workspace-content" className="skip-link">
        Skip to content
      </a>
      <div
        aria-hidden="true"
        className="premium-shell-grid pointer-events-none fixed inset-0 z-0"
      />
      <WorkspaceSidebar />
      <div className="relative z-10 min-w-0">
        <WorkspaceTopbar />
        <motion.main
          id="workspace-content"
          key={location.pathname}
          className="premium-page px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-6"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          tabIndex={-1}
        >
          <Outlet />
        </motion.main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
