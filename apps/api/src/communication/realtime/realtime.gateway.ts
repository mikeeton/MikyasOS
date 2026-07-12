import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

type RealtimePayload = {
  organisationId?: string;
  conversationId?: string;
  meetingId?: string;
  userId?: string;
};

@WebSocketGateway({ cors: true, namespace: 'communication' })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit('communication.connected', {
      status: 'connected',
      supportedEvents: [
        'message.new',
        'message.typing',
        'presence.update',
        'message.read',
        'message.edited',
        'message.deleted',
        'meeting.invitation',
        'announcement.delivery',
      ],
    });
  }

  @SubscribeMessage('conversation.join')
  joinConversation(@ConnectedSocket() client: Socket, @MessageBody() payload: RealtimePayload) {
    if (payload.organisationId && payload.conversationId) {
      void client.join(this.conversationRoom(payload.organisationId, payload.conversationId));
    }
    return { ok: true };
  }

  @SubscribeMessage('typing')
  typing(@MessageBody() payload: RealtimePayload) {
    if (payload.organisationId && payload.conversationId) {
      this.server
        .to(this.conversationRoom(payload.organisationId, payload.conversationId))
        .emit('message.typing', payload);
    }
    return { ok: true };
  }

  emitMessage(organisationId: string, conversationId: string, payload: unknown) {
    this.server
      .to(this.conversationRoom(organisationId, conversationId))
      .emit('message.new', payload);
  }

  emitMessageEdited(organisationId: string, conversationId: string, payload: unknown) {
    this.server
      .to(this.conversationRoom(organisationId, conversationId))
      .emit('message.edited', payload);
  }

  emitMessageDeleted(organisationId: string, conversationId: string, payload: unknown) {
    this.server
      .to(this.conversationRoom(organisationId, conversationId))
      .emit('message.deleted', payload);
  }

  emitAnnouncement(organisationId: string, payload: unknown) {
    this.server.to(this.organisationRoom(organisationId)).emit('announcement.delivery', payload);
  }

  emitMeetingInvitation(organisationId: string, payload: unknown) {
    this.server.to(this.organisationRoom(organisationId)).emit('meeting.invitation', payload);
  }

  emitPresence(organisationId: string, payload: unknown) {
    this.server.to(this.organisationRoom(organisationId)).emit('presence.update', payload);
  }

  private conversationRoom(organisationId: string, conversationId: string) {
    return `org:${organisationId}:conversation:${conversationId}`;
  }

  private organisationRoom(organisationId: string) {
    return `org:${organisationId}`;
  }
}
