import { NotFoundException } from '@nestjs/common';

import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  it('rejects contacts linked to companies outside the active organisation', async () => {
    const contacts = { create: jest.fn() };
    const companies = { findById: jest.fn().mockResolvedValue(null) };
    const activities = { record: jest.fn() };
    const auditLogs = { record: jest.fn() };
    const service = new ContactsService(
      contacts as never,
      companies as never,
      activities as never,
      auditLogs as never,
    );

    await expect(
      service.create('org-a', 'user-id', {
        companyId: 'company-from-org-b',
        firstName: 'Ada',
        lastName: 'Lovelace',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(companies.findById).toHaveBeenCalledWith('org-a', 'company-from-org-b');
    expect(contacts.create).not.toHaveBeenCalled();
  });
});
