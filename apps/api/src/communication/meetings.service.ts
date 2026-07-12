import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateMeetingDto,
  ListCommunicationDto,
  UpdateMeetingDto,
} from './dto/communication.dto';
import { RealtimeGateway } from './realtime/realtime.gateway';

@Injectable()
export class MeetingsService {
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
      this.prisma.meeting.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startsAt: 'asc' },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          participants: true,
          notes: { where: { deletedAt: null }, take: 3, orderBy: { updatedAt: 'desc' } },
        },
      }),
      this.prisma.meeting.count({ where }),
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
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        notes: {
          where: { deletedAt: null },
          include: { author: { select: { id: true, name: true, email: true } } },
        },
        recordings: true,
        project: { select: { id: true, name: true, status: true } },
        company: { select: { id: true, name: true, status: true } },
        document: { select: { id: true, title: true, documentType: true } },
        task: { select: { id: true, title: true, status: true } },
      },
    });
    if (!meeting) throw new NotFoundException('Meeting was not found.');
    return meeting;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateMeetingDto) {
    this.validateTime(dto.startsAt, dto.endsAt);
    const meeting = await this.prisma.meeting.create({
      data: {
        organisationId,
        organizerId: actorUserId,
        title: dto.title,
        description: dto.description,
        agenda: dto.agenda,
        location: dto.location,
        status: dto.status,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        projectId: dto.projectId,
        companyId: dto.companyId,
        documentId: dto.documentId,
        taskId: dto.taskId,
        videoUrl: 'Video meeting integration prepared',
        participants: {
          create: [
            { organisationId, userId: actorUserId, status: 'ACCEPTED', role: 'organizer' },
            ...(dto.participants ?? []).map((participant) => ({
              organisationId,
              userId: participant.userId,
              email: participant.email,
              name: participant.name,
              status: participant.status,
            })),
          ],
        },
      },
      include: { participants: true },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting.created',
      entityType: 'meeting',
      entityId: meeting.id,
    });
    this.realtime.emitMeetingInvitation(organisationId, meeting);
    return meeting;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateMeetingDto) {
    await this.assertExists(organisationId, id);
    if (dto.startsAt && dto.endsAt) this.validateTime(dto.startsAt, dto.endsAt);
    const meeting = await this.prisma.meeting.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        agenda: dto.agenda,
        location: dto.location,
        status: dto.status,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        projectId: dto.projectId,
        companyId: dto.companyId,
        documentId: dto.documentId,
        taskId: dto.taskId,
      },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting.updated',
      entityType: 'meeting',
      entityId: id,
    });
    return meeting;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    await this.assertExists(organisationId, id);
    await this.prisma.meeting.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CANCELLED' },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting.cancelled',
      entityType: 'meeting',
      entityId: id,
    });
    return { success: true };
  }

  private async assertExists(organisationId: string, id: string) {
    const count = await this.prisma.meeting.count({
      where: { id, organisationId, deletedAt: null },
    });
    if (!count) throw new NotFoundException('Meeting was not found.');
  }

  private validateTime(startsAt: string, endsAt: string) {
    if (new Date(startsAt) >= new Date(endsAt)) {
      throw new BadRequestException('Meeting end time must be after start time.');
    }
  }
}
