import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationType, MessageActivityAction } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateConversationDto,
  ListCommunicationDto,
  UpdateConversationDto,
} from './dto/communication.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string, query: ListCommunicationDto) {
    const page = query.page;
    const pageSize = query.pageSize;
    const where = {
      organisationId,
      deletedAt: null,
      ...(query.search
        ? { name: { contains: query.search.trim(), mode: 'insensitive' as const } }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.conversation.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          members: { include: { user: { select: { id: true, name: true, email: true } } } },
          _count: { select: { messages: true } },
        },
      }),
      this.prisma.conversation.count({ where }),
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

  async findOne(organisationId: string, id: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 25,
          include: { author: { select: { id: true, name: true, email: true } }, reactions: true },
        },
      },
    });
    if (!conversation) throw new NotFoundException('Conversation was not found.');
    return conversation;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateConversationDto) {
    const memberIds = Array.from(new Set([actorUserId, ...(dto.memberUserIds ?? [])]));
    const conversation = await this.prisma.conversation.create({
      data: {
        organisationId,
        name: dto.type === ConversationType.DIRECT ? (dto.name ?? null) : dto.name,
        description: dto.description,
        type: dto.type,
        visibility: dto.visibility,
        department: dto.department,
        projectId: dto.projectId,
        createdById: actorUserId,
        members: {
          create: memberIds.map((userId) => ({
            organisationId,
            userId,
            role: userId === actorUserId ? 'OWNER' : 'MEMBER',
          })),
        },
      },
      include: { members: true },
    });
    await this.prisma.messageActivity.create({
      data: {
        organisationId,
        conversationId: conversation.id,
        actorId: actorUserId,
        action: MessageActivityAction.SENT,
        metadata: { event: 'conversation.created' },
      },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'conversation.created',
      entityType: 'conversation',
      entityId: conversation.id,
    });
    return conversation;
  }

  async update(
    organisationId: string,
    actorUserId: string,
    id: string,
    dto: UpdateConversationDto,
  ) {
    await this.assertExists(organisationId, id);
    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: dto,
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'conversation.updated',
      entityType: 'conversation',
      entityId: id,
    });
    return conversation;
  }

  async archive(organisationId: string, actorUserId: string, id: string, isArchived = true) {
    await this.assertExists(organisationId, id);
    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: { isArchived },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: isArchived ? 'conversation.archived' : 'conversation.restored',
      entityType: 'conversation',
      entityId: id,
    });
    return conversation;
  }

  private async assertExists(organisationId: string, id: string) {
    const count = await this.prisma.conversation.count({
      where: { id, organisationId, deletedAt: null },
    });
    if (!count) throw new NotFoundException('Conversation was not found.');
  }
}
