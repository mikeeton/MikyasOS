import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  it('returns true when every required permission is granted by the member role', async () => {
    const prisma = {
      organisationMember: {
        findFirst: jest.fn().mockResolvedValue({
          role: {
            rolePermissions: [
              { permission: { key: 'organisation:read' } },
              { permission: { key: 'members:invite' } },
            ],
          },
        }),
      },
    };
    const service = new PermissionsService(prisma as never);

    await expect(
      service.userHasPermissions('user-id', 'org-id', ['organisation:read', 'members:invite']),
    ).resolves.toBe(true);
  });

  it('returns false when a required permission is missing', async () => {
    const prisma = {
      organisationMember: {
        findFirst: jest.fn().mockResolvedValue({
          role: { rolePermissions: [{ permission: { key: 'organisation:read' } }] },
        }),
      },
    };
    const service = new PermissionsService(prisma as never);

    await expect(service.userHasPermissions('user-id', 'org-id', ['roles:assign'])).resolves.toBe(
      false,
    );
  });

  it('backfills default permissions for existing system member roles', async () => {
    const prisma = {
      organisationMember: {
        findFirst: jest.fn().mockResolvedValue({
          role: {
            id: 'role-id',
            type: 'MEMBER',
            isSystem: true,
            rolePermissions: [{ permission: { key: 'organisation:read' } }],
          },
        }),
      },
      permission: {
        upsert: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([{ id: 'permission-id' }]),
      },
      rolePermission: {
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const service = new PermissionsService(prisma as never);

    await expect(service.userHasPermissions('user-id', 'org-id', ['Project.Read'])).resolves.toBe(
      true,
    );
    expect(prisma.rolePermission.createMany).toHaveBeenCalledWith(
      expect.objectContaining({ skipDuplicates: true }),
    );
  });
});
