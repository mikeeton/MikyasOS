import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  it('records customer activity and audit logs when creating a company', async () => {
    const company = { id: 'company-id', name: 'Acme', organisationId: 'org-id' };
    const companies = { create: jest.fn().mockResolvedValue(company) };
    const activities = { record: jest.fn() };
    const auditLogs = { record: jest.fn() };
    const service = new CompaniesService(
      companies as never,
      activities as never,
      auditLogs as never,
    );

    const result = await service.create('org-id', 'user-id', { name: 'Acme' });

    expect(result).toEqual(company);
    expect(companies.create).toHaveBeenCalledWith('org-id', { name: 'Acme' });
    expect(activities.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organisationId: 'org-id',
        actorUserId: 'user-id',
        companyId: 'company-id',
        type: 'COMPANY_CREATED',
      }),
    );
    expect(auditLogs.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organisationId: 'org-id',
        actorUserId: 'user-id',
        action: 'crm.company.created',
        entityId: 'company-id',
      }),
    );
  });
});
