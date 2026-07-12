import { Injectable, NotFoundException } from '@nestjs/common';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateAnnouncementDto,
  ListCommunicationDto,
  UpdateAnnouncementDto,
} from './dto/communication.dto';
import { RealtimeGateway } from './realtime/realtime.gateway';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string, query: ListCommunicationDto) {
    const page = query.page;
    const pageSize = query.pageSize;
    const where = {
      organisationId,
      deletedAt: null,
      ...(query.search
        ? { title: { contains: query.search.trim(), mode: 'insensitive' as const } }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.announcement.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.announcement.count({ where }),
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

  async create(organisationId: string, actorUserId: string, dto: CreateAnnouncementDto) {
    const announcement = await this.prisma.announcement.create({
      data: {
        organisationId,
        authorId: actorUserId,
        title: dto.title,
        body: dto.body,
        priority: dto.priority,
        isPinned: dto.isPinned,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        publishedAt: new Date(),
      },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'announcement.created',
      entityType: 'announcement',
      entityId: announcement.id,
    });
    this.realtime.emitAnnouncement(organisationId, announcement);
    return announcement;
  }

  async update(
    organisationId: string,
    actorUserId: string,
    id: string,
    dto: UpdateAnnouncementDto,
  ) {
    await this.assertExists(organisationId, id);
    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'announcement.updated',
      entityType: 'announcement',
      entityId: id,
    });
    return announcement;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    await this.assertExists(organisationId, id);
    await this.prisma.announcement.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'announcement.deleted',
      entityType: 'announcement',
      entityId: id,
    });
    return { success: true };
  }

  private async assertExists(organisationId: string, id: string) {
    const count = await this.prisma.announcement.count({
      where: { id, organisationId, deletedAt: null },
    });
    if (!count) throw new NotFoundException('Announcement was not found.');
  }
}
