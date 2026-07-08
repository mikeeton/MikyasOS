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
});
