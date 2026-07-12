import { AuditSeverity, EnterprisePolicyType, PolicyStatus } from '@prisma/client';

import { EnterpriseService } from './enterprise.service';

describe('EnterpriseService', () => {
  function service() {
    const prisma = {
      $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
      businessUnit: {
        count: jest.fn().mockResolvedValue(2),
        create: jest.fn().mockResolvedValue({ id: 'unit-id', name: 'Operations' }),
      },
      customRole: {
        count: jest.fn().mockResolvedValue(3),
        create: jest.fn().mockResolvedValue({ id: 'role-id', name: 'Regional Admin' }),
      },
      auditEvent: {
        count: jest.fn().mockResolvedValue(5),
        create: jest.fn().mockResolvedValue({ id: 'audit-id' }),
      },
      complianceRecord: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'compliance-id' }),
      },
      enterprisePolicy: {
        count: jest.fn().mockResolvedValue(4),
        create: jest.fn().mockResolvedValue({ id: 'policy-id' }),
      },
      sSOProvider: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'sso-id' }),
      },
      directoryConnection: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'directory-id' }),
      },
      license: {
        findFirst: jest.fn().mockResolvedValue({ plan: 'Enterprise', seats: 20, usedSeats: 8 }),
        create: jest.fn().mockResolvedValue({ id: 'license-id' }),
      },
      session: { count: jest.fn().mockResolvedValue(6) },
      organisationHierarchy: {
        create: jest.fn().mockResolvedValue({ id: 'hierarchy-id' }),
      },
      permissionGroup: {
        create: jest.fn().mockResolvedValue({ id: 'group-id' }),
      },
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'global-audit-id' }) };
    return { service: new EnterpriseService(prisma as never, audit as never), prisma, audit };
  }

  it('builds an enterprise administration dashboard', async () => {
    const { service: enterprise } = service();

    const dashboard = await enterprise.dashboard('org-id');

    expect(dashboard.businessUnits).toBe(2);
    expect(dashboard.customRoles).toBe(3);
    expect(dashboard.activeSessions).toBe(6);
    expect(dashboard.licenseUsage.plan).toBe('Enterprise');
  });

  it('creates business units and audit events', async () => {
    const { service: enterprise, prisma, audit } = service();

    await enterprise.createBusinessUnit('org-id', 'user-id', { name: 'Operations' });

    expect(prisma.businessUnit.create).toHaveBeenCalled();
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'enterprise.business_unit.created' }),
    );
    expect(prisma.auditEvent.create).toHaveBeenCalled();
  });

  it('creates hierarchy and custom role architecture records', async () => {
    const { service: enterprise, prisma } = service();

    await enterprise.createHierarchy('org-id', 'user-id', {
      parentOrganisationId: '00000000-0000-0000-0000-000000000001',
      childOrganisationId: '00000000-0000-0000-0000-000000000002',
    });
    await enterprise.createCustomRole('org-id', 'user-id', {
      name: 'Regional Admin',
      permissions: ['Enterprise.Read'],
      delegatedAdmin: true,
    });

    expect(prisma.organisationHierarchy.create).toHaveBeenCalled();
    expect(prisma.customRole.create).toHaveBeenCalled();
  });

  it('creates policy and audit records', async () => {
    const { service: enterprise, prisma } = service();

    await enterprise.createPolicy('org-id', 'user-id', {
      type: EnterprisePolicyType.SECURITY,
      name: 'MFA policy',
      status: PolicyStatus.ACTIVE,
      rules: { mfaRequired: true },
    });
    await enterprise.createAuditEvent('org-id', 'user-id', {
      severity: AuditSeverity.HIGH,
      action: 'permission.changed',
      module: 'enterprise',
    });

    expect(prisma.enterprisePolicy.create).toHaveBeenCalled();
    expect(prisma.auditEvent.create).toHaveBeenCalled();
  });
});
