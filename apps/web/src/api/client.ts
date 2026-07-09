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
