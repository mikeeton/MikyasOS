# mikyasOS Communication & Meetings

Milestone 8 adds the Communication & Meetings platform. It extends identity, organisations, CRM, projects, documents, and the AI Operating System.

## Architecture

The backend module is `CommunicationModule`.

It provides:

- Conversations
- Messages
- Threads
- Announcements
- Meetings
- Meeting notes
- Presence
- Realtime events
- Notification preferences
- AI preparation services

The frontend routes use the existing authenticated workspace shell and TanStack Query API layer.

## Database Relationships

New Prisma models:

- `Conversation`
- `ConversationMember`
- `Message`
- `MessageAttachment`
- `MessageReaction`
- `MessageReadReceipt`
- `Thread`
- `Announcement`
- `Meeting`
- `MeetingParticipant`
- `MeetingNote`
- `MeetingRecording`
- `MessageActivity`
- `NotificationPreference`

Every model is scoped by `organisationId`, uses UUID primary keys, includes audit timestamps, supports soft deletion where useful, and has tenant-aware indexes.

Meetings can link to:

- Projects
- Tasks
- CRM companies
- Documents

Meeting notes can link to the same objects and are prepared for future AI summaries.

## Realtime Architecture

Realtime runs through the `communication` WebSocket namespace.

Prepared events:

- `message.new`
- `message.typing`
- `presence.update`
- `message.read`
- `message.edited`
- `message.deleted`
- `meeting.invitation`
- `announcement.delivery`

REST services emit gateway events after writes. The gateway is intentionally lightweight in this milestone and is ready for stricter socket authentication in the next pass.

## Meeting Architecture

Meetings support:

- Create, update, cancel
- Organizer
- Participants
- Agenda
- Location
- Video meeting placeholder
- Linked project, company, document, and task
- Notes
- Recording placeholder

AI preparation services:

- `MeetingSummaryService`
- `MeetingActionExtractionService`
- `MeetingEmbeddingService`

No LLM meeting summaries are generated yet.

## API Endpoints

Communication:

- `GET /api/v1/communication/capabilities`

Conversations:

- `GET /api/v1/conversations`
- `GET /api/v1/conversations/:id`
- `POST /api/v1/conversations`
- `PATCH /api/v1/conversations/:id`
- `POST /api/v1/conversations/:id/archive`
- `POST /api/v1/conversations/:id/restore`

Messages:

- `GET /api/v1/messages/conversation/:id`
- `POST /api/v1/messages`
- `PATCH /api/v1/messages/:id`
- `DELETE /api/v1/messages/:id`
- `POST /api/v1/messages/:id/reactions`
- `POST /api/v1/messages/:id/read`

Threads:

- `GET /api/v1/threads/conversation/:id`
- `POST /api/v1/threads`

Announcements:

- `GET /api/v1/announcements`
- `POST /api/v1/announcements`
- `PATCH /api/v1/announcements/:id`
- `DELETE /api/v1/announcements/:id`

Meetings:

- `GET /api/v1/meetings`
- `GET /api/v1/meetings/:id`
- `POST /api/v1/meetings`
- `PATCH /api/v1/meetings/:id`
- `DELETE /api/v1/meetings/:id`

Meeting notes:

- `GET /api/v1/meeting-notes`
- `POST /api/v1/meeting-notes`
- `PATCH /api/v1/meeting-notes/:id`
- `DELETE /api/v1/meeting-notes/:id`

Presence:

- `GET /api/v1/presence`
- `PATCH /api/v1/presence/me`

## Security

All REST endpoints use:

- `JwtAuthGuard`
- `OrganisationGuard`
- `PermissionsGuard`

New permissions:

- `Communication.Read`
- `Communication.Write`
- `Communication.Manage`
- `Meetings.Read`
- `Meetings.Write`
- `Announcements.Manage`

## Frontend Routes

- `/app/chat`
- `/app/chat/:conversationId`
- `/app/channels`
- `/app/announcements`
- `/app/meetings`
- `/app/meetings/:id`
- `/app/meeting-notes`
- `/app/presence`

## Developer Guide

Use the frontend API layer in `apps/web/src/api/client.ts` and hooks in `apps/web/src/features/communication/hooks/use-communication.ts`.

Communication data should always be loaded through TanStack Query and never fetched directly inside page components.

## Current Limits

This milestone does not implement:

- Real video calling
- Voice notes
- Polls
- LLM summaries
- Recording upload/processing
- External calendar sync

The database, REST, realtime, and UI architecture are prepared for those features.
