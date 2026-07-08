import { ProjectActivityType } from '@prisma/client';

import { TasksService } from './tasks.service';

describe('TasksService', () => {
  it('checks tenant relations and records activity when creating a task', async () => {
    const task = { id: 'task-id', projectId: 'project-id', title: 'Follow up' };
    const tasks = { create: jest.fn().mockResolvedValue(task) };
    const relations = {
      assertProject: jest.fn(),
      assertTask: jest.fn(),
      assertMember: jest.fn(),
    };
    const activities = { record: jest.fn() };
    const auditLogs = { record: jest.fn() };
    const service = new TasksService(
      tasks as never,
      relations as never,
      activities as never,
      auditLogs as never,
    );

    const result = await service.create('org-id', 'user-id', {
      projectId: 'project-id',
      parentTaskId: 'parent-id',
      assigneeId: 'assignee-id',
      title: 'Follow up',
    });

    expect(result).toEqual(task);
    expect(relations.assertProject).toHaveBeenCalledWith('org-id', 'project-id');
    expect(relations.assertTask).toHaveBeenCalledWith('org-id', 'parent-id');
    expect(relations.assertMember).toHaveBeenCalledWith('org-id', 'assignee-id');
    expect(activities.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organisationId: 'org-id',
        projectId: 'project-id',
        taskId: 'task-id',
        type: ProjectActivityType.TASK_CREATED,
      }),
    );
  });
});
