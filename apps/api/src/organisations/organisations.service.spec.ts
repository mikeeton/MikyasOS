import { OrganisationsService } from './organisations.service';

describe('OrganisationsService', () => {
  it('creates an organisation with an owner membership and audit log', async () => {
    const createdOrganisation = { id: 'org-id', name: 'Acme', slug: 'acme' };
    const ownerRole = { id: 'role-id' };
    const tx = {
      organisation: {
        create: jest.fn().mockResolvedValue(createdOrganisation),
      },
      role: {
        create: jest.fn().mockResolvedValue(ownerRole),
        createMany: jest.fn(),
      },
      permission: {
        findMany: jest.fn().mockResolvedValue([{ id: 'permission-id' }]),
      },
      rolePermission: { createMany: jest.fn() },
      organisationMember: { create: jest.fn() },
      user: { update: jest.fn() },
    };
    const prisma = {
      organisation: { findUnique: jest.fn().mockResolvedValue(null) },
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    const auditLogs = { record: jest.fn() };
    const permissions = { ensureDefaults: jest.fn() };
    const service = new OrganisationsService(
      prisma as never,
      auditLogs as never,
      permissions as never,
    );

    const result = await service.create('user-id', { name: 'Acme' });

    expect(result).toEqual(createdOrganisation);
    const memberCreate = tx.organisationMember.create as jest.MockedFunction<
      (input: { data: { organisationId: string; userId: string } }) => void
    >;
    const memberCreatePayload = memberCreate.mock.calls[0]?.[0];
    if (!memberCreatePayload) {
      throw new Error('Expected member creation payload.');
    }
    expect(memberCreatePayload.data).toMatchObject({ organisationId: 'org-id', userId: 'user-id' });
    expect(auditLogs.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'organisation.created', organisationId: 'org-id' }),
    );
  });
});
