import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';
import type { CreateThreadDto } from './dto/communication.dto';

@Injectable()
export class ThreadsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organisationId: string, conversationId: string) {
    return this.prisma.thread.findMany({
      where: { organisationId, conversationId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { rootMessage: true, messages: { where: { deletedAt: null }, take: 10 } },
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateThreadDto) {
    const message = await this.prisma.message.findFirst({
      where: {
        id: dto.rootMessageId,
        conversationId: dto.conversationId,
        organisationId,
        deletedAt: null,
      },
    });
    if (!message) throw new NotFoundException('Root message was not found.');
    return this.prisma.thread.create({
      data: {
        organisationId,
        conversationId: dto.conversationId,
        rootMessageId: dto.rootMessageId,
        title: dto.title,
        createdById: actorUserId,
      },
      include: { rootMessage: true },
    });
  }
}
