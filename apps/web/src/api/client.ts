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

export type PaginatedResult<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CrmQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type CrmTag = {
  id: string;
  name: string;
  color: string;
};

export type Company = {
  id: string;
  name: string;
  legalName?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  companySize?: string | null;
  annualRevenue?: string | number | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  postcode?: string | null;
  linkedin?: string | null;
  status: string;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
  contacts?: Contact[];
  leads?: Lead[];
  opportunities?: Opportunity[];
  notes?: CustomerNote[];
  files?: CustomerFile[];
  activities?: CustomerActivity[];
  tags?: Array<{ tag: CrmTag }>;
  _count?: { contacts: number; leads: number; opportunities: number; notes: number };
};

export type Contact = {
  id: string;
  companyId?: string | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  linkedin?: string | null;
  avatar?: string | null;
  birthday?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: Company | null;
  activities?: CustomerActivity[];
  customerNotes?: CustomerNote[];
  files?: CustomerFile[];
};

export type Lead = {
  id: string;
  companyId?: string | null;
  assignedTo?: string | null;
  source?: string | null;
  status: string;
  probability: number;
  estimatedValue?: string | number | null;
  expectedCloseDate?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: Company | null;
  assignee?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type Opportunity = {
  id: string;
  companyId?: string | null;
  owner?: string | null;
  stage: string;
  probability: number;
  estimatedRevenue?: string | number | null;
  expectedCloseDate?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  company?: Company | null;
  ownerUser?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type CustomerNote = {
  id: string;
  companyId?: string | null;
  contactId?: string | null;
  content: string;
  createdAt: string;
  author?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type CustomerFile = {
  id: string;
  companyId?: string | null;
  contactId?: string | null;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  uploadedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type CustomerActivity = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
};

export type CrmAiCapability = {
  key:
    | 'customer-summary'
    | 'lead-analysis'
    | 'opportunity-review'
    | 'relationship-risk'
    | 'follow-up-suggestions'
    | 'sales-recommendations';
  name: string;
  description: string;
  requiredPermission: 'crm:read';
  status: 'architecture_ready' | 'not_generated';
};

export type CrmAiCapabilities = {
  capabilities: CrmAiCapability[];
  summaryPlans: Array<{
    scope: 'executive' | 'company' | 'contact' | 'lead' | 'opportunity';
    title: string;
    sourceEntities: string[];
    outputSections: string[];
    status: 'architecture_ready' | 'not_generated';
  }>;
  embeddingPlan: {
    enabled: false;
    provider: 'openrouter';
    vectorStore: 'reserved';
    indexableEntities: string[];
    retrievalUseCases: string[];
    status: 'architecture_ready' | 'not_generated';
  };
  provider: {
    provider: 'openrouter';
    configured: boolean;
    directModelCoupling: false;
  };
  promptExecutionEnabled: false;
};

export type CrmPromptTemplates = {
  templates: Array<{
    key: CrmAiCapability['key'];
    title: string;
    objective: string;
    systemInstruction: string;
    userContextFields: string[];
    guardrails: string[];
  }>;
  promptExecutionEnabled: false;
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

const toQueryString = (query: CrmQuery) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const value = params.toString();
  return value ? `?${value}` : '';
};

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

export const crmApi = {
  companies: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<Company>>(`/companies${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  company: (token: string, organisationId: string, id: string) =>
    apiRequest<Company>(`/companies/${id}`, { token, organisationId }),
  createCompany: (token: string, organisationId: string, body: Partial<Company>) =>
    apiRequest<Company>('/companies', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateCompany: (token: string, organisationId: string, id: string, body: Partial<Company>) =>
    apiRequest<Company>(`/companies/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  contacts: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<Contact>>(`/contacts${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  contact: (token: string, organisationId: string, id: string) =>
    apiRequest<Contact>(`/contacts/${id}`, { token, organisationId }),
  createContact: (token: string, organisationId: string, body: Partial<Contact>) =>
    apiRequest<Contact>('/contacts', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateContact: (token: string, organisationId: string, id: string, body: Partial<Contact>) =>
    apiRequest<Contact>(`/contacts/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  leads: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<Lead>>(`/leads${toQueryString(query)}`, { token, organisationId }),
  createLead: (token: string, organisationId: string, body: Partial<Lead>) =>
    apiRequest<Lead>('/leads', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  opportunities: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<Opportunity>>(`/opportunities${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createOpportunity: (token: string, organisationId: string, body: Partial<Opportunity>) =>
    apiRequest<Opportunity>('/opportunities', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  notes: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<CustomerNote>>(`/customer-notes${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  files: (token: string, organisationId: string, query: CrmQuery = {}) =>
    apiRequest<PaginatedResult<CustomerFile>>(`/customer-files${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  tags: (token: string, organisationId: string) =>
    apiRequest<CrmTag[]>('/customer-tags', { token, organisationId }),
  search: (token: string, organisationId: string, q: string) =>
    apiRequest<{
      query: string;
      results: {
        companies: Company[];
        contacts: Contact[];
        leads: Lead[];
        opportunities: Opportunity[];
        tags: CrmTag[];
      };
    }>(`/crm/search?q=${encodeURIComponent(q)}`, { token, organisationId }),
  aiCapabilities: (token: string, organisationId: string) =>
    apiRequest<CrmAiCapabilities>('/crm/ai/capabilities', { token, organisationId }),
  aiPromptTemplates: (token: string, organisationId: string) =>
    apiRequest<CrmPromptTemplates>('/crm/ai/prompt-templates', { token, organisationId }),
};
