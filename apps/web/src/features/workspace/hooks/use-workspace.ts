import { useContext } from 'react';

import { WorkspaceContext } from '../context/workspace-context-value';

export function useWorkspace() {
  const value = useContext(WorkspaceContext);

  if (!value) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }

  return value;
}
