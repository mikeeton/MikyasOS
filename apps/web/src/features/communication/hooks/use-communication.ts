import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { communicationApi, type CommunicationQuery } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

function useCommunicationContext() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  return {
    token,
    organisationId: currentOrganisation?.id ?? null,
    enabled: Boolean(token && currentOrganisation?.id),
  };
}

export const communicationKeys = {
  all: ['communication'] as const,
  capabilities: (organisationId: string | null) =>
    [...communicationKeys.all, 'capabilities', organisationId] as const,
  conversations: (organisationId: string | null, query: CommunicationQuery) =>
    [...communicationKeys.all, 'conversations', organisationId, query] as const,
  messages: (organisationId: string | null, conversationId?: string) =>
    [...communicationKeys.all, 'messages', organisationId, conversationId] as const,
  announcements: (organisationId: string | null, query: CommunicationQuery) =>
    [...communicationKeys.all, 'announcements', organisationId, query] as const,
  meetings: (organisationId: string | null, query: CommunicationQuery) =>
    [...communicationKeys.all, 'meetings', organisationId, query] as const,
  meeting: (organisationId: string | null, id?: string) =>
    [...communicationKeys.all, 'meeting', organisationId, id] as const,
  notes: (organisationId: string | null) =>
    [...communicationKeys.all, 'meeting-notes', organisationId] as const,
  presence: (organisationId: string | null) =>
    [...communicationKeys.all, 'presence', organisationId] as const,
};

export function useCommunicationCapabilities() {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.capabilities(organisationId),
    queryFn: () => communicationApi.capabilities(token!, organisationId!),
    enabled,
  });
}

export function useConversations(query: CommunicationQuery = {}) {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.conversations(organisationId, query),
    queryFn: () => communicationApi.conversations(token!, organisationId!, query),
    enabled,
  });
}

export function useMessages(conversationId?: string) {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.messages(organisationId, conversationId),
    queryFn: () => communicationApi.messages(token!, organisationId!, conversationId!),
    enabled: enabled && Boolean(conversationId),
  });
}

export function useAnnouncements(query: CommunicationQuery = {}) {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.announcements(organisationId, query),
    queryFn: () => communicationApi.announcements(token!, organisationId!, query),
    enabled,
  });
}

export function useMeetings(query: CommunicationQuery = {}) {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.meetings(organisationId, query),
    queryFn: () => communicationApi.meetings(token!, organisationId!, query),
    enabled,
  });
}

export function useMeeting(id?: string) {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.meeting(organisationId, id),
    queryFn: () => communicationApi.meeting(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
}

export function useMeetingNotes() {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.notes(organisationId),
    queryFn: () => communicationApi.meetingNotes(token!, organisationId!),
    enabled,
  });
}

export function usePresence() {
  const { token, organisationId, enabled } = useCommunicationContext();
  return useQuery({
    queryKey: communicationKeys.presence(organisationId),
    queryFn: () => communicationApi.presence(token!, organisationId!),
    enabled,
  });
}

export function useCreateConversation() {
  const { token, organisationId } = useCommunicationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { type: string; name?: string; memberUserIds?: string[] }) =>
      communicationApi.createConversation(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communicationKeys.all }),
  });
}

export function useCreateMessage() {
  const { token, organisationId } = useCommunicationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { conversationId: string; content: string }) =>
      communicationApi.createMessage(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communicationKeys.all }),
  });
}

export function useUpdatePresence() {
  const { token, organisationId } = useCommunicationContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { presenceStatus: string; presenceMessage?: string }) =>
      communicationApi.updatePresence(token!, organisationId!, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communicationKeys.all }),
  });
}
