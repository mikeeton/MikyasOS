import type { AuthenticatedUser } from '../auth/types/authenticated-request';

export type AiOperatingContext = {
  organisationId: string;
  user: AuthenticatedUser;
  currentPage?: string;
  selectedEntity?: {
    type: 'crm.company' | 'crm.contact' | 'project' | 'task' | 'document';
    id: string;
  };
};

export type AiStructuredResponse = {
  answer: string;
  confidence: 'low' | 'medium' | 'high';
  citations: Array<{
    type: string;
    id: string;
    title: string;
  }>;
  suggestedActions: Array<{
    key: string;
    label: string;
    requiresConfirmation: true;
    status: 'prepared';
  }>;
  safety: {
    destructiveActionBlocked: boolean;
    groundedInBusinessData: boolean;
    permissionsApplied: boolean;
  };
};
