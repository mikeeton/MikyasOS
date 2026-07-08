import { ProjectActivityType } from '@prisma/client';

import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  it('records activity and audit logs when creating a project', async () => {
    const project = { id: 'project-id', name: 'Launch', organisationId: 'org-id' };
    const projects = { create: jest.fn().mockResolvedValue(project) };
    const relations = {
      assertCompany: jest.fn(),
      assertMember: jest.fn(),
    };
    const activities = { record: jest.fn() };
    const auditLogs = { record: jest.fn() };
    const service = new ProjectsService(
      projects as never,
      relations as never,
      activities as never,
      auditLogs as never,
    );

    const result = await service.create('org-id', 'user-id', {
      name: 'Launch',
      ownerId: 'owner-id',
    });

    expect(result).toEqual(project);
    expect(relations.assertMember).toHaveBeenCalledWith('org-id', 'owner-id');
    expect(projects.create).toHaveBeenCalledWith('org-id', 'user-id', {
      name: 'Launch',
      ownerId: 'owner-id',
    });
    expect(activities.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organisationId: 'org-id',
        projectId: 'project-id',
        actorUserId: 'user-id',
        type: ProjectActivityType.PROJECT_CREATED,
      }),
    );
    expect(auditLogs.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organisationId: 'org-id',
        actorUserId: 'user-id',
        action: 'project.created',
        entityId: 'project-id',
      }),
    );
  });
});
