import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  documentsApi,
  type CreateDocumentBody,
  type DocumentQuery,
  type DocumentTag,
  type KnowledgeDocument,
} from '@/api/client';
import { useDocumentsContext } from './use-documents-context';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (organisationId: string | null, query: DocumentQuery) =>
    [...documentKeys.lists(), organisationId, query] as const,
  detail: (organisationId: string | null, id: string | undefined) =>
    [...documentKeys.all, 'detail', organisationId, id] as const,
  folders: (organisationId: string | null, parentFolderId?: string) =>
    [...documentKeys.all, 'folders', organisationId, parentFolderId] as const,
  versions: (organisationId: string | null, id: string | undefined) =>
    [...documentKeys.all, 'versions', organisationId, id] as const,
  activity: (organisationId: string | null, id: string | undefined) =>
    [...documentKeys.all, 'activity', organisationId, id] as const,
  tags: (organisationId: string | null) => [...documentKeys.all, 'tags', organisationId] as const,
  aiCapabilities: (organisationId: string | null) =>
    [...documentKeys.all, 'ai-capabilities', organisationId] as const,
  aiReadiness: (organisationId: string | null, id: string | undefined) =>
    [...documentKeys.all, 'ai-readiness', organisationId, id] as const,
};

export function useDocuments(query: DocumentQuery = {}) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.list(organisationId, query),
    queryFn: () => documentsApi.documents(token!, organisationId!, query),
    enabled,
  });
}

export function useDocument(id?: string) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.detail(organisationId, id),
    queryFn: () => documentsApi.document(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
}

export function useFolders(parentFolderId?: string) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.folders(organisationId, parentFolderId),
    queryFn: () => documentsApi.folders(token!, organisationId!, parentFolderId),
    enabled,
  });
}

export const useFolderTree = useFolders;

export function useDocumentVersions(id?: string) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.versions(organisationId, id),
    queryFn: () => documentsApi.versions(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
}

export function useDocumentActivity(id?: string) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.activity(organisationId, id),
    queryFn: () => documentsApi.activity(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
}

export function useDocumentTags() {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.tags(organisationId),
    queryFn: () => documentsApi.tags(token!, organisationId!),
    enabled,
  });
}

export function useDocumentSearch(query: DocumentQuery) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: [...documentKeys.all, 'search', organisationId, query],
    queryFn: () => documentsApi.search(token!, organisationId!, query),
    enabled,
  });
}

export function useDocumentAiCapabilities() {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.aiCapabilities(organisationId),
    queryFn: () => documentsApi.aiCapabilities(token!, organisationId!),
    enabled,
  });
}

export function useDocumentAiReadiness(id?: string) {
  const { token, organisationId, enabled } = useDocumentsContext();
  return useQuery({
    queryKey: documentKeys.aiReadiness(organisationId, id),
    queryFn: () => documentsApi.aiReadiness(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
}

export function useUploadDocument() {
  const { token, organisationId } = useDocumentsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDocumentBody) =>
      documentsApi.createDocument(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useCreateFolder() {
  const { token, organisationId } = useDocumentsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; parentFolderId?: string; description?: string }) =>
      documentsApi.createFolder(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useCreateDocumentTag() {
  const { token, organisationId } = useDocumentsContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Pick<DocumentTag, 'name'> & Partial<DocumentTag>) =>
      documentsApi.createTag(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.tags(organisationId) }),
  });
}

export function useLinkedRecords(_document?: KnowledgeDocument) {
  return {
    records: _document?.links ?? [],
    preparedFutureTypes: ['Invoice', 'Meeting', 'Automation', 'AI Memory'],
  };
}

export function useDocumentPermissions() {
  return {
    inherited: true,
    levels: ['VIEW', 'COMMENT', 'EDIT', 'MANAGE', 'OWNER'],
    externalSharingEnabled: false,
  };
}
