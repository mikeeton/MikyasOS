import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import {
  ConversationSearchService,
  ConversationSummaryService,
  KnowledgeLinkService,
  MeetingActionExtractionService,
  MeetingEmbeddingService,
  MeetingSummaryService,
} from './communication-ai.service';
import { NotificationsService } from './notifications.service';

@Controller({ path: 'communication', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class CommunicationController {
  constructor(
    private readonly meetingSummary: MeetingSummaryService,
    private readonly actionExtraction: MeetingActionExtractionService,
    private readonly conversationSummary: ConversationSummaryService,
    private readonly conversationSearch: ConversationSearchService,
    private readonly meetingEmbeddings: MeetingEmbeddingService,
    private readonly knowledgeLinks: KnowledgeLinkService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Communication.Read')
  capabilities() {
    return {
      modules: [
        'Conversations',
        'Messages',
        'Threads',
        'Announcements',
        'Meetings',
        'Meeting Notes',
        'Presence',
        'Realtime',
        'Notifications',
      ],
      realtime: {
        websocketNamespace: 'communication',
        events: [
          'message.new',
          'message.typing',
          'presence.update',
          'message.read',
          'message.edited',
          'message.deleted',
          'meeting.invitation',
          'announcement.delivery',
        ],
      },
      aiPreparation: {
        meetingSummary: this.meetingSummary.getArchitecture(),
        actionExtraction: this.actionExtraction.getArchitecture(),
        conversationSummary: this.conversationSummary.getArchitecture(),
        conversationSearch: this.conversationSearch.getArchitecture(),
        meetingEmbeddings: this.meetingEmbeddings.getArchitecture(),
        knowledgeLinks: this.knowledgeLinks.getArchitecture(),
      },
      notifications: this.notifications.getArchitecture(),
    };
  }
}
