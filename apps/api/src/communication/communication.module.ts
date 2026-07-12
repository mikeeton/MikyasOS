import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { CommunicationController } from './communication.controller';
import {
  ConversationSearchService,
  ConversationSummaryService,
  KnowledgeLinkService,
  MeetingActionExtractionService,
  MeetingEmbeddingService,
  MeetingSummaryService,
} from './communication-ai.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MeetingNotesController } from './meeting-notes.controller';
import { MeetingNotesService } from './meeting-notes.service';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { NotificationsService } from './notifications.service';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule],
  controllers: [
    CommunicationController,
    ConversationsController,
    MessagesController,
    ThreadsController,
    AnnouncementsController,
    MeetingsController,
    MeetingNotesController,
    PresenceController,
  ],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    RealtimeGateway,
    ConversationsService,
    MessagesService,
    ThreadsService,
    AnnouncementsService,
    MeetingsService,
    MeetingNotesService,
    PresenceService,
    NotificationsService,
    MeetingSummaryService,
    MeetingActionExtractionService,
    ConversationSummaryService,
    ConversationSearchService,
    MeetingEmbeddingService,
    KnowledgeLinkService,
  ],
  exports: [
    ConversationsService,
    MessagesService,
    MeetingsService,
    MeetingNotesService,
    PresenceService,
  ],
})
export class CommunicationModule {}

export class ConversationsModule {}
export class MessagesModule {}
export class ThreadsModule {}
export class AnnouncementsModule {}
export class MeetingsModule {}
export class MeetingNotesModule {}
export class PresenceModule {}
export class RealtimeModule {}
export class NotificationsModule {}
