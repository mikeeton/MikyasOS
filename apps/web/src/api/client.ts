type ApiEnvelope<T> = {
  data: T;
  requestId: string;
  timestamp: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  activeOrganisationId?: string | null;
};

export type Organisation = {
  id: string;
  name: string;
  slug: string;
  industry?: string | null;
  companySize?: string | null;
  country?: string | null;
  timezone?: string | null;
  currency?: string | null;
};

const apiBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
  organisationId?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  if (options.organisationId) {
    headers.set('x-organisation-id', options.organisationId);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as
    ApiEnvelope<T> | { error?: { message?: string } } | null;

  if (!response.ok) {
    const message =
      payload && 'error' in payload && payload.error?.message
        ? payload.error.message
        : 'Something went wrong.';
    throw new ApiError(message, response.status);
  }

  return payload && 'data' in payload ? payload.data : (payload as T);
}

export const identityApi = {
  register: (body: { email: string; name: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  refresh: (refreshToken: string) =>
    apiRequest<Pick<AuthResponse, 'accessToken' | 'refreshToken' | 'expiresAt'>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  currentUser: (token: string) => apiRequest<User>('/auth/me', { token }),
  organisations: (token: string) => apiRequest<Organisation[]>('/organisations', { token }),
  createOrganisation: (
    token: string,
    body: {
      name: string;
      industry?: string;
      companySize?: string;
      country?: string;
      timezone?: string;
      currency?: string;
    },
  ) =>
    apiRequest<Organisation>('/organisations', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  switchOrganisation: (token: string, organisationId: string) =>
    apiRequest<AuthResponse>('/auth/switch-organisation', {
      method: 'POST',
      token,
      body: JSON.stringify({ organisationId }),
    }),
  inviteUser: (token: string, organisationId: string, body: { email: string; roleId: string }) =>
    apiRequest<{ invitation: unknown; token: string }>('/invitations', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  acceptInvitation: (body: { token: string; name?: string; password?: string }) =>
    apiRequest<AuthResponse>('/invitations/accept', { method: 'POST', body: JSON.stringify(body) }),
  logout: (token: string) =>
    apiRequest<{ success: true }>('/auth/logout', { method: 'POST', token }),
};
