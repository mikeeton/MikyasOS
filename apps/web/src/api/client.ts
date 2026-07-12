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

export type WorkQuery = CrmQuery & {
  priority?: string;
  projectId?: string;
  assigneeId?: string;
};

export type AutomationQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type FinanceQuery = AutomationQuery & {
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type AnalyticsQuery = AutomationQuery;

export type IntegrationsQuery = AutomationQuery & {
  category?: string;
  status?: string;
};

export type AdminQuery = AutomationQuery;

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

export type ProjectAiCapabilities = {
  capabilities: Array<{
    key: string;
    name: string;
    description: string;
    requiredPermission: string;
    status: string;
  }>;
  provider: {
    abstraction: string;
    providerAgnostic: boolean;
    configured: boolean;
  };
  promptExecutionEnabled: false;
  embeddingsEnabled: false;
  conversationalAiEnabled: false;
};

export type ProjectAiPromptTemplates = {
  templates: Array<{
    key: string;
    name: string;
    purpose: string;
    systemInstruction: string;
    userContextFields: string[];
    guardrails: string[];
  }>;
  promptExecutionEnabled: false;
};

export type AiOsCapabilities = {
  architecture: string;
  orchestrator: string;
  services: string[];
  agents: string[];
  execution: {
    modelCallsEnabled: boolean;
    actionExecutionEnabled: boolean;
    confirmationRequired: boolean;
  };
  security: {
    organisationIsolation: boolean;
    rbac: boolean;
    auditLogging: boolean;
  };
};

export type AiPromptTemplates = {
  templates: Array<{
    key: string;
    title: string;
    objective: string;
    guardrails: string[];
  }>;
  promptExecutionEnabled: false;
  storage: string;
  directPromptHardcoding: false;
};

export type AiMemoryOverview = {
  conversationMemory: Record<string, unknown>;
  businessMemory: {
    enabled: boolean;
    organisationScoped: boolean;
    documentCount: number;
    projectCount: number;
    companyCount: number;
  };
  preferences: unknown[];
  importantFacts: unknown[];
  pinnedMemories: unknown[];
  recentActions: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId?: string | null;
    createdAt: string;
  }>;
  episodicMemoryPrepared: boolean;
};

export type AiSettingsOverview = {
  provider: {
    name: string;
    configured: boolean;
  };
  guardrails: Record<string, unknown>;
  features: Record<string, boolean>;
};

export type AiRetrievalStatus = {
  pgvectorPrepared: boolean;
  embeddingsEnabled: boolean;
  semanticSearchEnabled: boolean;
  retrievableSources: string[];
  futureSources: string[];
  embeddings: Record<string, unknown>;
};

export type AiActionCatalogue = {
  actions: Array<{
    key: string;
    requiresConfirmation: boolean;
    executionEnabled: boolean;
    status: string;
  }>;
};

export type AiOrchestrateResponse = {
  response: {
    answer: string;
    confidence: 'low' | 'medium' | 'high';
    citations: Array<{ type: string; id: string; title: string }>;
    suggestedActions: Array<{
      key: string;
      label: string;
      requiresConfirmation: true;
      status: string;
    }>;
    safety: Record<string, boolean>;
  };
  context: Record<string, unknown>;
  retrieval: Record<string, unknown>;
  reasoning: Record<string, unknown>;
  streamingPrepared: boolean;
  modelExecutionEnabled: boolean;
};

export type CommunicationQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type Conversation = {
  id: string;
  organisationId: string;
  name?: string | null;
  description?: string | null;
  type: string;
  visibility: string;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { messages?: number };
};

export type CommunicationMessage = {
  id: string;
  conversationId: string;
  authorId: string;
  content: string;
  markdown: boolean;
  mentions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'email'>;
  reactions?: Array<{ id: string; emoji: string; userId: string }>;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  priority: string;
  isPinned: boolean;
  publishedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  author?: Pick<User, 'id' | 'name' | 'email'>;
};

export type Meeting = {
  id: string;
  title: string;
  description?: string | null;
  agenda?: string | null;
  location?: string | null;
  videoUrl?: string | null;
  status: string;
  startsAt: string;
  endsAt: string;
  participants?: Array<{ id: string; email?: string | null; name?: string | null; status: string }>;
  notes?: MeetingNote[];
};

export type MeetingNote = {
  id: string;
  meetingId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  meeting?: Pick<Meeting, 'id' | 'title' | 'startsAt'>;
  author?: Pick<User, 'id' | 'name' | 'email'>;
};

export type PresenceRecord = {
  id: string;
  userId: string;
  presenceStatus: string;
  presenceMessage?: string | null;
  lastSeenAt?: string | null;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  currentProject?: Pick<Project, 'id' | 'name'> | null;
};

export type CommunicationCapabilities = {
  modules: string[];
  realtime: {
    websocketNamespace: string;
    events: string[];
  };
  aiPreparation: Record<string, unknown>;
  notifications: Record<string, unknown>;
};

export type DocumentQuery = CrmQuery & {
  folderId?: string;
  ownerId?: string;
  tagId?: string;
  documentType?: string;
  visibility?: string;
  mimeType?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
};

export type DocumentOwner = Pick<User, 'id' | 'name' | 'email'>;

export type DocumentFolder = {
  id: string;
  name: string;
  description?: string | null;
  path: string;
  depth?: number;
  parentFolderId?: string | null;
  colour?: string | null;
  icon?: string | null;
  visibility?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: { childFolders?: number; documents?: number };
};

export type DocumentTag = {
  id: string;
  organisationId: string;
  name: string;
  colour: string;
  description?: string | null;
};

export type KnowledgeDocument = {
  id: string;
  organisationId: string;
  folderId?: string | null;
  ownerId: string;
  title: string;
  description?: string | null;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileExtension: string;
  fileSize: number;
  documentType: string;
  status: string;
  visibility: string;
  isPinned: boolean;
  isLocked: boolean;
  checksum?: string;
  createdAt: string;
  updatedAt: string;
  folder?: Pick<DocumentFolder, 'id' | 'name' | 'path'> | null;
  owner?: DocumentOwner | null;
  currentVersion?: DocumentVersion | null;
  tags?: Array<{ tag: DocumentTag }>;
  links?: DocumentLink[];
  versions?: DocumentVersion[];
  activities?: DocumentActivity[];
  _count?: { versions?: number; activities?: number; links?: number };
};

export type DocumentVersion = {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  changeNote?: string | null;
  createdAt: string;
  uploadedBy?: DocumentOwner | null;
};

export type DocumentActivity = {
  id: string;
  documentId?: string | null;
  folderId?: string | null;
  action: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: DocumentOwner | null;
};

export type DocumentLink = {
  id: string;
  documentId: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export type CreateDocumentBody = {
  folderId?: string;
  title: string;
  description?: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  visibility?: string;
  isPinned?: boolean;
};

export type DocumentAiCapabilities = {
  capabilities: Array<{
    key: string;
    name: string;
    description: string;
    status: string;
    queueBacked: boolean;
  }>;
  promptExecutionEnabled: false;
  embeddingsEnabled: false;
  vectorSearchEnabled: false;
  ocrEnabled: false;
  realtimeEnabled: false;
  provider: {
    abstraction: string;
    configured: boolean;
    directStorageAccess: false;
    providerAgnostic: true;
  };
};

export type DocumentAiReadiness = {
  documentId: string;
  status: string;
  indexedAt: string | null;
  textExtracted: boolean;
  metadataExtracted: boolean;
  thumbnailGenerated: boolean;
  ocrPrepared: boolean;
  embeddingsPrepared: boolean;
  graphPrepared: boolean;
};

export type Project = {
  id: string;
  organisationId: string;
  companyId?: string | null;
  ownerId: string;
  name: string;
  description?: string | null;
  status: string;
  priority: string;
  progress: number;
  budget?: string | number | null;
  estimatedHours?: string | number | null;
  actualHours?: string | number | null;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: Pick<Company, 'id' | 'name'> | null;
  owner?: Pick<User, 'id' | 'name' | 'email'> | null;
  tasks?: Task[];
  milestones?: ProjectMilestone[];
  files?: ProjectFile[];
  activities?: ProjectActivity[];
  _count?: {
    tasks: number;
    milestones: number;
    files: number;
    comments: number;
  };
};

export type Task = {
  id: string;
  organisationId: string;
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeId?: string | null;
  reporterId?: string | null;
  estimatedHours?: string | number | null;
  actualHours?: string | number | null;
  dueDate?: string | null;
  position: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Pick<Project, 'id' | 'name'> | null;
  parentTask?: Pick<Task, 'id' | 'title'> | null;
  subtasks?: Task[];
  assignee?: Pick<User, 'id' | 'name' | 'email'> | null;
  reporter?: Pick<User, 'id' | 'name' | 'email'> | null;
  comments?: ProjectComment[];
  files?: ProjectFile[];
  labels?: Array<{ label: ProjectLabel }>;
  timeEntries?: TimeEntry[];
  _count?: {
    comments: number;
    subtasks: number;
    files: number;
  };
};

export type ProjectMilestone = {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectLabel = {
  id: string;
  organisationId: string;
  name: string;
  colour: string;
  icon?: string | null;
};

export type ProjectComment = {
  id: string;
  projectId: string;
  taskId?: string | null;
  parentCommentId?: string | null;
  authorId?: string | null;
  content: string;
  mentions?: string[] | null;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'email'> | null;
  replies?: ProjectComment[];
};

export type ProjectFile = {
  id: string;
  projectId: string;
  taskId?: string | null;
  commentId?: string | null;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  uploadedById?: string | null;
  createdAt: string;
  uploadedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type TimeEntry = {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string | null;
  durationMinutes?: number | null;
  manualEntry: boolean;
  description?: string | null;
};

export type ProjectActivity = {
  id: string;
  projectId: string;
  taskId?: string | null;
  milestoneId?: string | null;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
  actorUser?: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type WorkloadRow = {
  user: Pick<User, 'id' | 'name' | 'email'>;
  openTasks: number;
  estimatedHours: number;
  capacityStatus: 'available' | 'busy' | 'overloaded';
  tasks: Task[];
};

export type Role = {
  id: string;
  organisationId: string;
  name: string;
  type: string;
  isSystem: boolean;
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

const toQueryString = (query: Record<string, unknown>) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') &&
      value !== ''
    ) {
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
  roles: (token: string, organisationId: string) =>
    apiRequest<Role[]>('/roles', { token, organisationId }),
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

export const projectsApi = {
  projects: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<PaginatedResult<Project>>(`/projects${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  project: (token: string, organisationId: string, id: string) =>
    apiRequest<Project>(`/projects/${id}`, { token, organisationId }),
  createProject: (token: string, organisationId: string, body: Partial<Project>) =>
    apiRequest<Project>('/projects', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateProject: (token: string, organisationId: string, id: string, body: Partial<Project>) =>
    apiRequest<Project>(`/projects/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  archiveProject: (token: string, organisationId: string, id: string) =>
    apiRequest<Project>(`/projects/${id}/archive`, { method: 'POST', token, organisationId }),
  tasks: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<PaginatedResult<Task>>(`/tasks${toQueryString(query)}`, { token, organisationId }),
  task: (token: string, organisationId: string, id: string) =>
    apiRequest<Task>(`/tasks/${id}`, { token, organisationId }),
  createTask: (token: string, organisationId: string, body: Partial<Task>) =>
    apiRequest<Task>('/tasks', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateTask: (token: string, organisationId: string, id: string, body: Partial<Task>) =>
    apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  moveTask: (
    token: string,
    organisationId: string,
    id: string,
    body: Pick<Partial<Task>, 'projectId' | 'parentTaskId' | 'status' | 'position'>,
  ) =>
    apiRequest<Task>(`/tasks/${id}/move`, {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  completeTask: (token: string, organisationId: string, id: string) =>
    apiRequest<Task>(`/tasks/${id}/complete`, { method: 'POST', token, organisationId }),
  milestones: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<ProjectMilestone[]>(`/milestones${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  comments: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<ProjectComment[]>(`/comments${toQueryString(query)}`, { token, organisationId }),
  files: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<ProjectFile[]>(`/project-files${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createFile: (
    token: string,
    organisationId: string,
    body: Pick<
      ProjectFile,
      'projectId' | 'storageKey' | 'originalFilename' | 'mimeType' | 'fileSize'
    > &
      Partial<Pick<ProjectFile, 'taskId' | 'commentId'>>,
  ) =>
    apiRequest<ProjectFile>('/project-files', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  activities: (token: string, organisationId: string, query: WorkQuery = {}) =>
    apiRequest<ProjectActivity[]>(`/project-activities${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  workload: (token: string, organisationId: string) =>
    apiRequest<WorkloadRow[]>('/workload', { token, organisationId }),
  search: (token: string, organisationId: string, q: string) =>
    apiRequest<{
      query: string;
      results: {
        projects: Project[];
        tasks: Task[];
        labels: ProjectLabel[];
        comments: ProjectComment[];
      };
    }>(`/project-search?q=${encodeURIComponent(q)}`, { token, organisationId }),
  aiCapabilities: (token: string, organisationId: string) =>
    apiRequest<ProjectAiCapabilities>('/projects/ai/capabilities', { token, organisationId }),
  aiPromptTemplates: (token: string, organisationId: string) =>
    apiRequest<ProjectAiPromptTemplates>('/projects/ai/prompt-templates', {
      token,
      organisationId,
    }),
};

export const documentsApi = {
  documents: (token: string, organisationId: string, query: DocumentQuery = {}) =>
    apiRequest<PaginatedResult<KnowledgeDocument>>(`/documents${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  document: (token: string, organisationId: string, id: string) =>
    apiRequest<KnowledgeDocument>(`/documents/${id}`, { token, organisationId }),
  createDocument: (token: string, organisationId: string, body: CreateDocumentBody) =>
    apiRequest<KnowledgeDocument>('/documents', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateDocument: (
    token: string,
    organisationId: string,
    id: string,
    body: Partial<
      Pick<KnowledgeDocument, 'title' | 'description' | 'visibility' | 'isPinned' | 'isLocked'>
    > & {
      folderId?: string | null;
    },
  ) =>
    apiRequest<KnowledgeDocument>(`/documents/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  deleteDocument: (token: string, organisationId: string, id: string) =>
    apiRequest<{ success: true }>(`/documents/${id}`, { method: 'DELETE', token, organisationId }),
  downloadDocument: (token: string, organisationId: string, id: string) =>
    apiRequest<{ fileName: string; mimeType: string; fileSize: number; downloadUrl: string }>(
      `/documents/${id}/download`,
      { method: 'POST', token, organisationId },
    ),
  folders: (token: string, organisationId: string, parentFolderId?: string) =>
    apiRequest<DocumentFolder[]>(`/folders${toQueryString({ parentFolderId })}`, {
      token,
      organisationId,
    }),
  createFolder: (
    token: string,
    organisationId: string,
    body: Pick<DocumentFolder, 'name'> &
      Partial<
        Pick<DocumentFolder, 'description' | 'parentFolderId' | 'colour' | 'icon' | 'visibility'>
      >,
  ) =>
    apiRequest<DocumentFolder>('/folders', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateFolder: (
    token: string,
    organisationId: string,
    id: string,
    body: Partial<
      Pick<
        DocumentFolder,
        'name' | 'description' | 'parentFolderId' | 'colour' | 'icon' | 'visibility'
      >
    >,
  ) =>
    apiRequest<DocumentFolder>(`/folders/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  deleteFolder: (token: string, organisationId: string, id: string) =>
    apiRequest<{ success: true }>(`/folders/${id}`, { method: 'DELETE', token, organisationId }),
  versions: (token: string, organisationId: string, documentId: string) =>
    apiRequest<DocumentVersion[]>(`/documents/${documentId}/versions`, { token, organisationId }),
  activity: (token: string, organisationId: string, documentId: string) =>
    apiRequest<DocumentActivity[]>(`/documents/${documentId}/activity`, { token, organisationId }),
  tags: (token: string, organisationId: string) =>
    apiRequest<DocumentTag[]>('/document-tags', { token, organisationId }),
  createTag: (
    token: string,
    organisationId: string,
    body: Pick<DocumentTag, 'name'> & Partial<DocumentTag>,
  ) =>
    apiRequest<DocumentTag>('/document-tags', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  deleteTag: (token: string, organisationId: string, id: string) =>
    apiRequest<{ success: true }>(`/document-tags/${id}`, {
      method: 'DELETE',
      token,
      organisationId,
    }),
  assignTag: (token: string, organisationId: string, documentId: string, tagId: string) =>
    apiRequest<{ id: string }>(`/documents/${documentId}/tags`, {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify({ tagId }),
    }),
  linkRecord: (
    token: string,
    organisationId: string,
    documentId: string,
    body: Pick<DocumentLink, 'entityType' | 'entityId'>,
  ) =>
    apiRequest<DocumentLink>(`/documents/${documentId}/links`, {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  search: (token: string, organisationId: string, query: DocumentQuery = {}) =>
    apiRequest<PaginatedResult<KnowledgeDocument>>(`/documents-search${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  aiCapabilities: (token: string, organisationId: string) =>
    apiRequest<DocumentAiCapabilities>('/documents/ai/capabilities', { token, organisationId }),
  aiPromptTemplates: (token: string, organisationId: string) =>
    apiRequest<{ templates: unknown[]; promptExecutionEnabled: false }>(
      '/documents/ai/prompt-templates',
      { token, organisationId },
    ),
  aiReadiness: (token: string, organisationId: string, documentId: string) =>
    apiRequest<DocumentAiReadiness>(`/documents/${documentId}/ai/readiness`, {
      token,
      organisationId,
    }),
};

export const aiOsApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<AiOsCapabilities>('/ai/capabilities', { token, organisationId }),
  prompts: (token: string, organisationId: string) =>
    apiRequest<AiPromptTemplates>('/ai/prompts', { token, organisationId }),
  memory: (token: string, organisationId: string) =>
    apiRequest<AiMemoryOverview>('/ai/memory', { token, organisationId }),
  settings: (token: string, organisationId: string) =>
    apiRequest<AiSettingsOverview>('/ai/settings', { token, organisationId }),
  retrievalStatus: (token: string, organisationId: string) =>
    apiRequest<AiRetrievalStatus>('/ai/retrieval/status', { token, organisationId }),
  actions: (token: string, organisationId: string) =>
    apiRequest<AiActionCatalogue>('/ai/actions', { token, organisationId }),
  conversations: (token: string, organisationId: string) =>
    apiRequest<{
      conversations: unknown[];
      threadingEnabled: boolean;
      streamingPrepared: boolean;
      markdownEnabled: boolean;
      citationsEnabled: boolean;
    }>('/ai/conversations', { token, organisationId }),
  orchestrate: (
    token: string,
    organisationId: string,
    body: { message: string; currentPage?: string },
  ) =>
    apiRequest<AiOrchestrateResponse>('/ai/orchestrate', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
};

export type WorkflowTriggerType =
  | 'CUSTOMER_CREATED'
  | 'LEAD_WON'
  | 'PROJECT_CREATED'
  | 'TASK_COMPLETED'
  | 'DOCUMENT_UPLOADED'
  | 'MEETING_ENDED'
  | 'INVOICE_PAID'
  | 'CALENDAR_EVENT'
  | 'WEBHOOK_RECEIVED'
  | 'MANUAL'
  | 'SCHEDULED';

export type WorkflowActionType =
  | 'CREATE_TASK'
  | 'ASSIGN_TASK'
  | 'CREATE_PROJECT'
  | 'CREATE_COMPANY'
  | 'CREATE_CONTACT'
  | 'SEND_NOTIFICATION'
  | 'SEND_EMAIL'
  | 'GENERATE_AI_SUMMARY'
  | 'CREATE_MEETING'
  | 'CREATE_CALENDAR_EVENT'
  | 'MOVE_CRM_STAGE'
  | 'UPDATE_RECORD'
  | 'CREATE_DOCUMENT'
  | 'RUN_WEBHOOK'
  | 'WAIT'
  | 'APPROVAL';

export type Workflow = {
  id: string;
  organisationId: string;
  name: string;
  description?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  enabled: boolean;
  triggerType: WorkflowTriggerType;
  createdAt: string;
  updatedAt: string;
  triggers?: WorkflowTrigger[];
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  schedules?: WorkflowSchedule[];
  _count?: { executions: number };
};

export type WorkflowTrigger = {
  id: string;
  type: WorkflowTriggerType;
  config: Record<string, unknown>;
};

export type WorkflowCondition = {
  id?: string;
  operator: string;
  field: string;
  value?: unknown;
  position?: number;
};

export type WorkflowAction = {
  id?: string;
  type: WorkflowActionType;
  name: string;
  config?: Record<string, unknown>;
  position?: number;
};

export type WorkflowExecution = {
  id: string;
  workflowId: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'WAITING_APPROVAL';
  triggerPayload?: Record<string, unknown>;
  context?: Record<string, unknown>;
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  createdAt: string;
  workflow?: Pick<Workflow, 'id' | 'name'>;
  logs?: WorkflowLog[];
  errors?: WorkflowError[];
};

export type WorkflowLog = {
  id: string;
  workflowId: string;
  executionId?: string | null;
  step: string;
  message: string;
  severity: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  createdAt: string;
  workflow?: Pick<Workflow, 'id' | 'name'>;
};

export type WorkflowError = {
  id: string;
  code: string;
  message: string;
  createdAt: string;
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  isSystem: boolean;
  definition: Record<string, unknown>;
};

export type WorkflowSchedule = {
  id: string;
  workflowId: string;
  type: 'ONCE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CRON';
  cronExpression?: string | null;
  timezone: string;
  nextRunAt?: string | null;
  workflow?: Pick<Workflow, 'id' | 'name'>;
};

export type WorkflowVariable = {
  id: string;
  workflowId?: string | null;
  key: string;
  value: unknown;
  isSecret: boolean;
};

export type WorkflowApproval = {
  id: string;
  workflowId: string;
  executionId?: string | null;
  title: string;
  details: Record<string, unknown>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  decidedAt?: string | null;
  workflow?: Pick<Workflow, 'id' | 'name'>;
};

export type AutomationCapabilities = {
  architecture: string[];
  triggers: string[];
  actions: string[];
  queue: {
    queue: string;
    jobs: string[];
    backgroundExecution: boolean;
    retryReady: boolean;
    scheduledJobsReady: boolean;
  };
  aiPreparation: Record<string, unknown>;
};

export type CreateWorkflowBody = {
  name: string;
  description?: string;
  status?: Workflow['status'];
  enabled?: boolean;
  triggerType: WorkflowTriggerType;
  triggerConfig?: Record<string, unknown>;
  conditions?: Array<Pick<WorkflowCondition, 'operator' | 'field' | 'value'>>;
  actions?: Array<Pick<WorkflowAction, 'type' | 'name' | 'config'>>;
};

export const automationApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<AutomationCapabilities>('/automation/capabilities', { token, organisationId }),
  workflows: (token: string, organisationId: string, query: AutomationQuery = {}) =>
    apiRequest<PaginatedResult<Workflow>>(`/automation/workflows${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  workflow: (token: string, organisationId: string, id: string) =>
    apiRequest<Workflow>(`/automation/workflows/${id}`, { token, organisationId }),
  createWorkflow: (token: string, organisationId: string, body: CreateWorkflowBody) =>
    apiRequest<Workflow>('/automation/workflows', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateWorkflow: (token: string, organisationId: string, id: string, body: Partial<Workflow>) =>
    apiRequest<Workflow>(`/automation/workflows/${id}`, {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  executeWorkflow: (
    token: string,
    organisationId: string,
    id: string,
    payload: Record<string, unknown> = {},
  ) =>
    apiRequest<WorkflowExecution>(`/automation/workflows/${id}/execute`, {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify({ payload }),
    }),
  executions: (token: string, organisationId: string) =>
    apiRequest<WorkflowExecution[]>('/automation/executions', { token, organisationId }),
  history: (token: string, organisationId: string) =>
    apiRequest<WorkflowExecution[]>('/automation/history', { token, organisationId }),
  logs: (token: string, organisationId: string) =>
    apiRequest<WorkflowLog[]>('/automation/logs', { token, organisationId }),
  templates: (token: string, organisationId: string) =>
    apiRequest<WorkflowTemplate[]>('/automation/templates', { token, organisationId }),
  schedules: (token: string, organisationId: string) =>
    apiRequest<WorkflowSchedule[]>('/automation/schedules', { token, organisationId }),
  createSchedule: (
    token: string,
    organisationId: string,
    body: Pick<WorkflowSchedule, 'workflowId' | 'type'> &
      Partial<Pick<WorkflowSchedule, 'cronExpression' | 'timezone'>>,
  ) =>
    apiRequest<WorkflowSchedule>('/automation/schedules', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  variables: (token: string, organisationId: string) =>
    apiRequest<WorkflowVariable[]>('/automation/variables', { token, organisationId }),
  createVariable: (
    token: string,
    organisationId: string,
    body: Pick<WorkflowVariable, 'key'> & Partial<WorkflowVariable>,
  ) =>
    apiRequest<WorkflowVariable>('/automation/variables', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  approvals: (token: string, organisationId: string) =>
    apiRequest<WorkflowApproval[]>('/automation/approvals', { token, organisationId }),
};

export type FinanceStatus =
  'DRAFT' | 'SENT' | 'APPROVED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID' | 'CANCELLED';

export type FinanceMoneyRecord = {
  id: string;
  organisationId: string;
  currency?: string;
  subtotal?: string | number;
  tax?: string | number;
  discount?: string | number;
  total?: string | number;
  amount?: string | number;
  balance?: string | number;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = FinanceMoneyRecord & {
  invoiceNumber: string;
  customerId?: string | null;
  projectId?: string | null;
  amountPaid?: string | number;
  issueDate: string;
  dueDate?: string | null;
  paidDate?: string | null;
  notes?: string | null;
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
};

export type Quote = FinanceMoneyRecord & {
  quoteNumber: string;
  customerId?: string | null;
  projectId?: string | null;
  expiryDate?: string | null;
};

export type Payment = FinanceMoneyRecord & {
  invoiceId?: string | null;
  customerId?: string | null;
  method: string;
  paymentDate: string;
  reference?: string | null;
};

export type Expense = FinanceMoneyRecord & {
  title: string;
  vendor?: string | null;
  categoryId?: string | null;
  customerId?: string | null;
  projectId?: string | null;
  expenseDate: string;
};

export type PurchaseOrder = FinanceMoneyRecord & {
  orderNumber: string;
  supplierId?: string | null;
  projectId?: string | null;
};

export type Budget = FinanceMoneyRecord & {
  name: string;
  amount: string | number;
  spent: string | number;
  periodStart: string;
  periodEnd: string;
};

export type CashFlowEntry = FinanceMoneyRecord & {
  direction: 'INFLOW' | 'OUTFLOW';
  expectedDate: string;
  actualDate?: string | null;
  description?: string | null;
};

export type FinancialReport = {
  id: string;
  type: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  data: Record<string, unknown>;
  createdAt: string;
};

export type FinanceDashboard = {
  revenue: number;
  amountPaid: number;
  expenses: number;
  profit: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  upcomingPayments: number;
  cashFlow: number;
  budgetUtilisation: Array<{
    id: string;
    name: string;
    amount: number;
    spent: number;
    utilisation: number;
  }>;
  recentTransactions: unknown[];
  aiFinancialInsights: { status: string; note: string };
};

export type FinanceCapabilities = {
  modules: string[];
  reports: string[];
  integrations: Record<string, string>;
  aiPreparation: Record<string, unknown>;
};

export type CreateInvoiceBody = {
  customerId?: string;
  projectId?: string;
  invoiceNumber?: string;
  status?: FinanceStatus;
  currency?: string;
  issueDate: string;
  dueDate?: string;
  notes?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discount?: number;
  }>;
};

export const financeApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<FinanceCapabilities>('/finance/capabilities', { token, organisationId }),
  dashboard: (token: string, organisationId: string) =>
    apiRequest<FinanceDashboard>('/finance/dashboard', { token, organisationId }),
  invoices: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<Invoice>>(`/finance/invoices${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createInvoice: (token: string, organisationId: string, body: CreateInvoiceBody) =>
    apiRequest<Invoice>('/finance/invoices', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  quotes: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<Quote>>(`/finance/quotes${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createQuote: (token: string, organisationId: string, body: Partial<CreateInvoiceBody>) =>
    apiRequest<Quote>('/finance/quotes', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  payments: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<Payment>>(`/finance/payments${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createPayment: (token: string, organisationId: string, body: Partial<Payment>) =>
    apiRequest<Payment>('/finance/payments', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  expenses: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<Expense>>(`/finance/expenses${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createExpense: (token: string, organisationId: string, body: Partial<Expense>) =>
    apiRequest<Expense>('/finance/expenses', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  purchaseOrders: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<PurchaseOrder>>(`/finance/purchase-orders${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  budgets: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<Budget>>(`/finance/budgets${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  cashFlow: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<CashFlowEntry>>(`/finance/cashflow${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  reports: (token: string, organisationId: string, query: FinanceQuery = {}) =>
    apiRequest<PaginatedResult<FinancialReport>>(`/finance/reports${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  reportSummary: (token: string, organisationId: string) =>
    apiRequest<Record<string, unknown>>('/finance/reports/summary', { token, organisationId }),
};

export type AnalyticsExecutiveDashboard = {
  companyHealthScore: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  salesPipeline: { leads: number; customers: number };
  projectsAtRisk: number;
  employeeCapacity: { status: string; tasks: number };
  outstandingInvoices: number;
  customerSatisfaction: { status: string; score: number | null };
  activity: {
    projects: number;
    tasks: number;
    documents: number;
    workflows: number;
    meetings: number;
  };
  aiExecutiveBriefing: { status: string; note: string };
};

export type AnalyticsCapabilities = {
  modules: string[];
  metrics: string[];
  reports: string[];
  charts: string[];
  forecasting: string[];
  aiPreparation: Record<string, unknown>;
};

export type AnalyticsDashboard = {
  id: string;
  name: string;
  description?: string | null;
  visibility: string;
  createdAt: string;
};

export type AnalyticsRecord = {
  id: string;
  name?: string;
  key?: string;
  type?: string;
  status?: string;
  createdAt: string;
};

export const analyticsApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<AnalyticsCapabilities>('/analytics/capabilities', { token, organisationId }),
  executive: (token: string, organisationId: string) =>
    apiRequest<AnalyticsExecutiveDashboard>('/analytics/executive', { token, organisationId }),
  dashboards: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsDashboard>>(
      `/analytics/dashboards${toQueryString(query)}`,
      {
        token,
        organisationId,
      },
    ),
  createDashboard: (
    token: string,
    organisationId: string,
    body: { name: string; description?: string },
  ) =>
    apiRequest<AnalyticsDashboard>('/analytics/dashboards', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  metrics: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/metrics${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  kpis: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/kpis${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createKpi: (token: string, organisationId: string, body: { name: string; target?: number }) =>
    apiRequest<AnalyticsRecord>('/analytics/kpis', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  reports: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/reports${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createReport: (token: string, organisationId: string, body: { name: string; type: string }) =>
    apiRequest<AnalyticsRecord>('/analytics/reports', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  forecasts: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/forecasts${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createForecast: (token: string, organisationId: string, body: { name: string; type: string }) =>
    apiRequest<AnalyticsRecord>('/analytics/forecasts', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  snapshots: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/snapshots${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createSnapshot: (token: string, organisationId: string) =>
    apiRequest<AnalyticsRecord>('/analytics/snapshots', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify({}),
    }),
  charts: (token: string, organisationId: string, query: AnalyticsQuery = {}) =>
    apiRequest<PaginatedResult<AnalyticsRecord>>(`/analytics/charts${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createChart: (
    token: string,
    organisationId: string,
    body: { name: string; type: string; config: Record<string, unknown> },
  ) =>
    apiRequest<AnalyticsRecord>('/analytics/charts', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
};

export type IntegrationConnector = {
  key: string;
  name: string;
  category: string;
  provider: string;
  description: string;
  authTypes: string[];
  verified: boolean;
  featured: boolean;
  actions: string[];
  installStatus?: string;
};

export type IntegrationRecord = {
  id: string;
  key?: string;
  name?: string;
  category?: string;
  provider?: string;
  status?: string;
  mode?: string;
  entity?: string;
  severity?: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
};

export type IntegrationCapabilities = {
  modules: string[];
  supportedIntegrations: IntegrationConnector[];
  oauth: string[];
  syncModes: string[];
  productionConnectorsEnabled: boolean;
  aiPreparation: Record<string, unknown>;
};

export type OAuthArchitecture = {
  provider: string;
  authorizationUrl: string;
  callbackUrl: string;
  pkceRequired: boolean;
  tokenStorage: string;
  productionOAuthEnabled: boolean;
};

export const integrationsApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<IntegrationCapabilities>('/integrations/capabilities', { token, organisationId }),
  marketplace: (token: string, organisationId: string) =>
    apiRequest<IntegrationConnector[]>('/integrations/marketplace', { token, organisationId }),
  installed: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(`/integrations${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  install: (token: string, organisationId: string, connectorKey: string) =>
    apiRequest<IntegrationRecord>(`/integrations/marketplace/${connectorKey}/install`, {
      method: 'POST',
      token,
      organisationId,
    }),
  connections: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(
      `/integrations/connections${toQueryString(query)}`,
      { token, organisationId },
    ),
  createCredential: (
    token: string,
    organisationId: string,
    body: {
      integrationId: string;
      authType: string;
      label: string;
      secret: Record<string, unknown>;
    },
  ) =>
    apiRequest<IntegrationRecord>('/integrations/credentials', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  syncs: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(`/integrations/syncs${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  startSync: (
    token: string,
    organisationId: string,
    body: { integrationId: string; mode: string; entity: string; connectionId?: string },
  ) =>
    apiRequest<IntegrationRecord>('/integrations/syncs', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  webhooks: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(
      `/integrations/webhooks${toQueryString(query)}`,
      { token, organisationId },
    ),
  createWebhook: (
    token: string,
    organisationId: string,
    body: {
      name: string;
      direction: string;
      url: string;
      integrationId?: string;
      events?: string[];
    },
  ) =>
    apiRequest<IntegrationRecord>('/integrations/webhooks', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  logs: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(`/integrations/logs${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  health: (token: string, organisationId: string, query: IntegrationsQuery = {}) =>
    apiRequest<PaginatedResult<IntegrationRecord>>(`/integrations/health${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  oauth: (token: string, organisationId: string, provider: string) =>
    apiRequest<OAuthArchitecture>(`/integrations/oauth/${provider}/architecture`, {
      token,
      organisationId,
    }),
};

export type AdminRecord = {
  id: string;
  name?: string;
  title?: string;
  status?: string;
  severity?: string;
  action?: string;
  module?: string;
  service?: string;
  metric?: string;
  type?: string;
  interval?: string;
  createdAt: string;
  updatedAt?: string;
};

export type EnterpriseDashboard = {
  organisationHealth: string;
  businessUnits: number;
  customRoles: number;
  auditEvents: number;
  complianceGaps: number;
  policies: number;
  ssoProviders: number;
  directoryConnections: number;
  activeSessions: number;
  licenseUsage: { plan: string; seats: number; usedSeats: number };
  aiSystemStatus: string;
};

export type PlatformOverview = {
  status: string;
  activeIncidents: number;
  backupStatus: string;
  failedJobs: number;
  activeFeatureFlags: number;
  estimatedCost: number;
  errorRate: number;
  latencyMs: number;
  health: Record<string, unknown>;
};

export type BillingPlan = {
  id?: string;
  tier: 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';
  name: string;
  description?: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  maxUsers: number;
  storageGb: number;
  aiTokensMonthly: number;
  automationsMonthly: number;
  projectsLimit: number;
  documentsLimit: number;
  apiAccess: boolean;
  supportLevel: string;
  enterpriseFeatures: boolean;
  features: string[];
};

export type BillingOverview = {
  subscription?: AdminRecord | null;
  plan: BillingPlan;
  usage: AdminRecord[];
  invoices: AdminRecord[];
  onboarding?: AdminRecord | null;
  imports: number;
  exports: number;
  support: { level: string; portalPrepared: boolean; statusPagePrepared: boolean };
};

export const enterpriseApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<Record<string, unknown>>('/enterprise/capabilities', { token, organisationId }),
  dashboard: (token: string, organisationId: string) =>
    apiRequest<EnterpriseDashboard>('/enterprise/dashboard', { token, organisationId }),
  businessUnits: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/enterprise/business-units${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  roles: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/enterprise/roles${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  policies: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/enterprise/policies${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  audit: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/enterprise/audit${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  compliance: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/enterprise/compliance${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createBusinessUnit: (
    token: string,
    organisationId: string,
    body: { name: string; code?: string },
  ) =>
    apiRequest<AdminRecord>('/enterprise/business-units', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  createRole: (
    token: string,
    organisationId: string,
    body: { name: string; permissions: string[] },
  ) =>
    apiRequest<AdminRecord>('/enterprise/roles', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
};

export const billingApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<Record<string, unknown>>('/billing/capabilities', { token, organisationId }),
  overview: (token: string, organisationId: string) =>
    apiRequest<BillingOverview>('/billing/overview', { token, organisationId }),
  plans: (token: string, organisationId: string) =>
    apiRequest<BillingPlan[]>('/billing/plans', { token, organisationId }),
  subscriptions: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/subscriptions${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  usage: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/usage${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  checkout: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/checkout${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  portal: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/portal${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  imports: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/imports${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  exports: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/billing/exports${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  emailTemplates: (token: string, organisationId: string) =>
    apiRequest<AdminRecord[]>('/billing/emails/templates', { token, organisationId }),
  legal: (token: string, organisationId: string) =>
    apiRequest<AdminRecord[]>('/billing/legal', { token, organisationId }),
  launchChecklist: (token: string, organisationId: string) =>
    apiRequest<AdminRecord[]>('/billing/launch-checklist', { token, organisationId }),
  createCheckout: (
    token: string,
    organisationId: string,
    body: { planId?: string; interval?: 'MONTHLY' | 'ANNUAL'; couponCode?: string },
  ) =>
    apiRequest<AdminRecord>('/billing/checkout', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  recordUsage: (
    token: string,
    organisationId: string,
    body: { metric: string; quantity: number; limit?: number; source?: string },
  ) =>
    apiRequest<AdminRecord>('/billing/usage', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  updateOnboarding: (
    token: string,
    organisationId: string,
    body: { status?: string; currentStep?: string; checklist?: Record<string, unknown> },
  ) =>
    apiRequest<AdminRecord>('/billing/onboarding', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
};

export const platformApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<Record<string, unknown>>('/platform/capabilities', { token, organisationId }),
  overview: (token: string, organisationId: string) =>
    apiRequest<PlatformOverview>('/platform/overview', { token, organisationId }),
  healthDetails: (token: string, organisationId: string) =>
    apiRequest<Record<string, unknown>>('/health/details', { token, organisationId }),
  health: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/health${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  incidents: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/incidents${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  backups: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/backups${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  deployments: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/deployments${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  featureFlags: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/feature-flags${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  jobs: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/jobs${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  costs: (token: string, organisationId: string, query: AdminQuery = {}) =>
    apiRequest<PaginatedResult<AdminRecord>>(`/platform/costs${toQueryString(query)}`, {
      token,
      organisationId,
    }),
};

export const communicationApi = {
  capabilities: (token: string, organisationId: string) =>
    apiRequest<CommunicationCapabilities>('/communication/capabilities', {
      token,
      organisationId,
    }),
  conversations: (token: string, organisationId: string, query: CommunicationQuery = {}) =>
    apiRequest<PaginatedResult<Conversation>>(`/conversations${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  conversation: (token: string, organisationId: string, id: string) =>
    apiRequest<Conversation>(`/conversations/${id}`, { token, organisationId }),
  createConversation: (
    token: string,
    organisationId: string,
    body: Partial<Conversation> & { memberUserIds?: string[] },
  ) =>
    apiRequest<Conversation>('/conversations', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  messages: (token: string, organisationId: string, conversationId: string) =>
    apiRequest<PaginatedResult<CommunicationMessage>>(`/messages/conversation/${conversationId}`, {
      token,
      organisationId,
    }),
  createMessage: (
    token: string,
    organisationId: string,
    body: Pick<CommunicationMessage, 'conversationId' | 'content'> &
      Partial<Pick<CommunicationMessage, 'mentions' | 'markdown'>>,
  ) =>
    apiRequest<CommunicationMessage>('/messages', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  announcements: (token: string, organisationId: string, query: CommunicationQuery = {}) =>
    apiRequest<PaginatedResult<Announcement>>(`/announcements${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createAnnouncement: (token: string, organisationId: string, body: Partial<Announcement>) =>
    apiRequest<Announcement>('/announcements', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  meetings: (token: string, organisationId: string, query: CommunicationQuery = {}) =>
    apiRequest<PaginatedResult<Meeting>>(`/meetings${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  meeting: (token: string, organisationId: string, id: string) =>
    apiRequest<Meeting>(`/meetings/${id}`, { token, organisationId }),
  createMeeting: (token: string, organisationId: string, body: Partial<Meeting>) =>
    apiRequest<Meeting>('/meetings', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  meetingNotes: (token: string, organisationId: string, query: CommunicationQuery = {}) =>
    apiRequest<MeetingNote[]>(`/meeting-notes${toQueryString(query)}`, {
      token,
      organisationId,
    }),
  createMeetingNote: (
    token: string,
    organisationId: string,
    body: Pick<MeetingNote, 'meetingId' | 'title' | 'content'>,
  ) =>
    apiRequest<MeetingNote>('/meeting-notes', {
      method: 'POST',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
  presence: (token: string, organisationId: string) =>
    apiRequest<PresenceRecord[]>('/presence', { token, organisationId }),
  updatePresence: (
    token: string,
    organisationId: string,
    body: Pick<PresenceRecord, 'presenceStatus'> & Partial<PresenceRecord>,
  ) =>
    apiRequest<PresenceRecord>('/presence/me', {
      method: 'PATCH',
      token,
      organisationId,
      body: JSON.stringify(body),
    }),
};
