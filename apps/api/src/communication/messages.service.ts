import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageActivityAction, MessageStatus } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateMessageDto,
  ListCommunicationDto,
  ReactToMessageDto,
  UpdateMessageDto,
} from './dto/communication.dto';
import { RealtimeGateway } from './realtime/realtime.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string, conversationId: string, query: ListCommunicationDto) {
    const page = query.page;
    const pageSize = query.pageSize;
    const where = { organisationId, conversationId, deletedAt: null };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          attachments: true,
          reactions: true,
          readReceipts: true,
        },
      }),
      this.prisma.message.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(organisationId: string, actorUserId: string, dto: CreateMessageDto) {
    await this.assertConversation(organisationId, dto.conversationId);
    const message = await this.prisma.message.create({
      data: {
        organisationId,
        conversationId: dto.conversationId,
        threadId: dto.threadId,
        parentId: dto.parentId,
        authorId: actorUserId,
        content: dto.content,
        markdown: dto.markdown ?? true,
        mentions: dto.mentions ?? [],
      },
      include: { author: { select: { id: true, name: true, email: true } }, reactions: true },
    });
    await this.recordActivity(
      organisationId,
      dto.conversationId,
      message.id,
      actorUserId,
      MessageActivityAction.SENT,
    );
    this.realtime.emitMessage(organisationId, dto.conversationId, message);
    return message;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateMessageDto) {
    const message = await this.findWritableMessage(organisationId, id, actorUserId);
    const updated = await this.prisma.message.update({
      where: { id },
      data: { content: dto.content, status: MessageStatus.EDITED, editedAt: new Date() },
    });
    await this.recordActivity(
      organisationId,
      message.conversationId,
      id,
      actorUserId,
      MessageActivityAction.EDITED,
    );
    this.realtime.emitMessageEdited(organisationId, message.conversationId, updated);
    return updated;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const message = await this.findWritableMessage(organisationId, id, actorUserId);
    await this.prisma.message.update({
      where: { id },
      data: { status: MessageStatus.DELETED, deletedAt: new Date() },
    });
    await this.recordActivity(
      organisationId,
      message.conversationId,
      id,
      actorUserId,
      MessageActivityAction.DELETED,
    );
    this.realtime.emitMessageDeleted(organisationId, message.conversationId, { id });
    return { success: true };
  }

  async react(organisationId: string, actorUserId: string, id: string, dto: ReactToMessageDto) {
    const message = await this.assertMessage(organisationId, id);
    const reaction = await this.prisma.messageReaction.upsert({
      where: { messageId_userId_emoji: { messageId: id, userId: actorUserId, emoji: dto.emoji } },
      update: { deletedAt: null },
      create: { organisationId, messageId: id, userId: actorUserId, emoji: dto.emoji },
    });
    await this.recordActivity(
      organisationId,
      message.conversationId,
      id,
      actorUserId,
      MessageActivityAction.REACTION_ADDED,
    );
    return reaction;
  }

  async markRead(organisationId: string, actorUserId: string, id: string) {
    const message = await this.assertMessage(organisationId, id);
    const receipt = await this.prisma.messageReadReceipt.upsert({
      where: { messageId_userId: { messageId: id, userId: actorUserId } },
      update: { readAt: new Date(), deletedAt: null },
      create: { organisationId, messageId: id, userId: actorUserId },
    });
    await this.recordActivity(
      organisationId,
      message.conversationId,
      id,
      actorUserId,
      MessageActivityAction.READ,
    );
    return receipt;
  }

  private async assertConversation(organisationId: string, conversationId: string) {
    const count = await this.prisma.conversation.count({
      where: { id: conversationId, organisationId, deletedAt: null },
    });
    if (!count) throw new NotFoundException('Conversation was not found.');
  }

  private async assertMessage(organisationId: string, id: string) {
    const message = await this.prisma.message.findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!message) throw new NotFoundException('Message was not found.');
    return message;
  }

  private async findWritableMessage(organisationId: string, id: string, actorUserId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id, organisationId, authorId: actorUserId, deletedAt: null },
    });
    if (!message) throw new NotFoundException('Message was not found.');
    return message;
  }

  private async recordActivity(
    organisationId: string,
    conversationId: string,
    messageId: string,
    actorId: string,
    action: MessageActivityAction,
  ) {
    await Promise.all([
      this.prisma.messageActivity.create({
        data: { organisationId, conversationId, messageId, actorId, action },
      }),
      this.audit.record({
        organisationId,
        actorUserId: actorId,
        action: `message.${action.toLowerCase()}`,
        entityType: 'message',
        entityId: messageId,
      }),
    ]);
  }
}
