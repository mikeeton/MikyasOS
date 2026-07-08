import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { WorkRelationsService } from '../common/work-relations.service';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projects: ProjectsRepository,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.projects.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const project = await this.projects.findById(organisationId, id);
    if (!project) throw new NotFoundException('Project was not found.');
    return project;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateProjectDto) {
    await this.relations.assertCompany(organisationId, dto.companyId);
    await this.relations.assertMember(organisationId, dto.ownerId ?? actorUserId);
    const project = await this.projects.create(organisationId, actorUserId, dto);
    await this.activities.record({
      organisationId,
      projectId: project.id,
      actorUserId,
      type: ProjectActivityType.PROJECT_CREATED,
      title: 'Project created',
      description: project.name,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'project.created',
      entityType: 'project',
      entityId: project.id,
    });
    return project;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateProjectDto) {
    await this.relations.assertCompany(organisationId, dto.companyId);
    await this.relations.assertMember(organisationId, dto.ownerId);
    const result = await this.projects.update(organisationId, id, dto);
    if (result.count === 0) throw new NotFoundException('Project was not found.');
    await this.activities.record({
      organisationId,
      projectId: id,
      actorUserId,
      type: ProjectActivityType.PROJECT_UPDATED,
      title: 'Project updated',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'project.updated',
      entityType: 'project',
      entityId: id,
    });
    return this.findOne(organisationId, id);
  }

  async archive(organisationId: string, actorUserId: string, id: string) {
    const result = await this.projects.archive(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Project was not found.');
    await this.activities.record({
      organisationId,
      projectId: id,
      actorUserId,
      type: ProjectActivityType.PROJECT_ARCHIVED,
      title: 'Project archived',
    });
    return this.findOne(organisationId, id);
  }

  async restore(organisationId: string, actorUserId: string, id: string) {
    const result = await this.projects.restore(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Project was not found.');
    await this.activities.record({
      organisationId,
      projectId: id,
      actorUserId,
      type: ProjectActivityType.PROJECT_RESTORED,
      title: 'Project restored',
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.projects.softDelete(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Project was not found.');
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'project.deleted',
      entityType: 'project',
      entityId: id,
    });
    return { success: true };
  }
}
