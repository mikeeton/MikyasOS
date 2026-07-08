import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import type { AssignTaskDto } from './dto/assign-task.dto';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { MoveTaskDto } from './dto/move-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasks: TasksRepository,
    private readonly relations: WorkRelationsService,
    private readonly activities: ProjectActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListWorkRecordsDto) {
    return this.tasks.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const task = await this.tasks.findById(organisationId, id);
    if (!task) throw new NotFoundException('Task was not found.');
    return task;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateTaskDto) {
    await this.assertRelations(organisationId, dto.projectId, dto.parentTaskId, dto.assigneeId);
    const task = await this.tasks.create(organisationId, actorUserId, dto);
    await this.activities.record({
      organisationId,
      projectId: task.projectId,
      taskId: task.id,
      actorUserId,
      type: ProjectActivityType.TASK_CREATED,
      title: 'Task created',
      description: task.title,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'task.created',
      entityType: 'task',
      entityId: task.id,
    });
    return task;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateTaskDto) {
    await this.assertRelations(organisationId, dto.projectId, dto.parentTaskId, dto.assigneeId);
    const before = await this.findOne(organisationId, id);
    const result = await this.tasks.update(organisationId, id, dto);
    if (result.count === 0) throw new NotFoundException('Task was not found.');
    await this.activities.record({
      organisationId,
      projectId: dto.projectId ?? before.projectId,
      taskId: id,
      actorUserId,
      type:
        dto.status && dto.status !== before.status
          ? ProjectActivityType.STATUS_CHANGED
          : ProjectActivityType.TASK_UPDATED,
      title: 'Task updated',
    });
    return this.findOne(organisationId, id);
  }

  async move(organisationId: string, actorUserId: string, id: string, dto: MoveTaskDto) {
    await this.assertRelations(organisationId, dto.projectId, dto.parentTaskId);
    const before = await this.findOne(organisationId, id);
    const result = await this.tasks.move(organisationId, id, dto);
    if (result.count === 0) throw new NotFoundException('Task was not found.');
    await this.activities.record({
      organisationId,
      projectId: dto.projectId ?? before.projectId,
      taskId: id,
      actorUserId,
      type: ProjectActivityType.TASK_MOVED,
      title: 'Task moved',
    });
    return this.findOne(organisationId, id);
  }

  async assign(organisationId: string, actorUserId: string, id: string, dto: AssignTaskDto) {
    await this.relations.assertMember(organisationId, dto.assigneeId);
    const task = await this.findOne(organisationId, id);
    const result = await this.tasks.assign(organisationId, id, dto.assigneeId);
    if (result.count === 0) throw new NotFoundException('Task was not found.');
    await this.activities.record({
      organisationId,
      projectId: task.projectId,
      taskId: id,
      actorUserId,
      type: ProjectActivityType.TASK_ASSIGNED,
      title: 'Task assigned',
      metadata: { assigneeId: dto.assigneeId },
    });
    return this.findOne(organisationId, id);
  }

  async complete(organisationId: string, actorUserId: string, id: string) {
    const task = await this.findOne(organisationId, id);
    const result = await this.tasks.complete(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Task was not found.');
    await this.activities.record({
      organisationId,
      projectId: task.projectId,
      taskId: id,
      actorUserId,
      type: ProjectActivityType.TASK_COMPLETED,
      title: 'Task completed',
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const task = await this.findOne(organisationId, id);
    const result = await this.tasks.softDelete(organisationId, id);
    if (result.count === 0) throw new NotFoundException('Task was not found.');
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'task.deleted',
      entityType: 'task',
      entityId: task.id,
    });
    return { success: true };
  }

  private async assertRelations(
    organisationId: string,
    projectId?: string,
    parentTaskId?: string,
    assigneeId?: string,
  ) {
    await this.relations.assertProject(organisationId, projectId);
    await this.relations.assertTask(organisationId, parentTaskId);
    await this.relations.assertMember(organisationId, assigneeId);
  }
}
