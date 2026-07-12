import { Injectable, NotFoundException } from '@nestjs/common';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateMeetingNoteDto,
  ListCommunicationDto,
  UpdateMeetingNoteDto,
} from './dto/communication.dto';

@Injectable()
export class MeetingNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  async list(organisationId: string, query: ListCommunicationDto) {
    return this.prisma.meetingNote.findMany({
      where: {
        organisationId,
        deletedAt: null,
        ...(query.search
          ? { title: { contains: query.search.trim(), mode: 'insensitive' as const } }
          : {}),
      },
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        meeting: { select: { id: true, title: true, startsAt: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(organisationId: string, actorUserId: string, dto: CreateMeetingNoteDto) {
    const meeting = await this.prisma.meeting.count({
      where: { id: dto.meetingId, organisationId, deletedAt: null },
    });
    if (!meeting) throw new NotFoundException('Meeting was not found.');
    const note = await this.prisma.meetingNote.create({
      data: {
        organisationId,
        meetingId: dto.meetingId,
        authorId: actorUserId,
        title: dto.title,
        content: dto.content,
        projectId: dto.projectId,
        companyId: dto.companyId,
        documentId: dto.documentId,
        taskId: dto.taskId,
        actionItems: { prepared: true, items: [] },
      },
    });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting-note.created',
      entityType: 'meeting-note',
      entityId: note.id,
    });
    return note;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateMeetingNoteDto) {
    await this.assertExists(organisationId, id);
    const note = await this.prisma.meetingNote.update({ where: { id }, data: dto });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting-note.updated',
      entityType: 'meeting-note',
      entityId: id,
    });
    return note;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    await this.assertExists(organisationId, id);
    await this.prisma.meetingNote.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.record({
      organisationId,
      actorUserId,
      action: 'meeting-note.deleted',
      entityType: 'meeting-note',
      entityId: id,
    });
    return { success: true };
  }

  private async assertExists(organisationId: string, id: string) {
    const count = await this.prisma.meetingNote.count({
      where: { id, organisationId, deletedAt: null },
    });
    if (!count) throw new NotFoundException('Meeting note was not found.');
  }
}
