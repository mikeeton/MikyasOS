import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationService {
  listConversations(organisationId: string, userId: string) {
    return {
      organisationId,
      userId,
      conversations: [],
      threadingEnabled: true,
      streamingPrepared: true,
      markdownEnabled: true,
      citationsEnabled: true,
    };
  }

  startConversation(message: string) {
    return {
      id: `preview-${Date.now()}`,
      title: message.slice(0, 60) || 'New AI thread',
      status: 'created',
      streamingPrepared: true,
    };
  }
}
