import type { Request } from 'express';

export type AuthenticatedUser = {
  id: string;
  email: string;
  activeOrganisationId?: string | null;
  sessionId?: string;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
  organisationId?: string;
};
