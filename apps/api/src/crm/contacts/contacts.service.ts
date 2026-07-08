import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { ContactsRepository } from './contacts.repository';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contacts: ContactsRepository,
    private readonly companies: CompaniesRepository,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.contacts.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const contact = await this.contacts.findById(organisationId, id);
    if (!contact) {
      throw new NotFoundException('Contact was not found.');
    }
    return contact;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateContactDto) {
    await this.assertCompany(organisationId, dto.companyId);
    const contact = await this.contacts.create(organisationId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: contact.companyId,
      contactId: contact.id,
      type: CustomerActivityType.CONTACT_ADDED,
      title: 'Contact added',
      description: `${contact.firstName} ${contact.lastName}`,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.contact.created',
      entityType: 'contact',
      entityId: contact.id,
    });
    return contact;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateContactDto) {
    await this.assertCompany(organisationId, dto.companyId);
    const result = await this.contacts.update(organisationId, id, dto);
    if (result.count === 0) {
      throw new NotFoundException('Contact was not found.');
    }
    await this.activities.record({
      organisationId,
      actorUserId,
      contactId: id,
      companyId: dto.companyId,
      type: CustomerActivityType.CUSTOMER_EDITED,
      title: 'Contact updated',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.contact.updated',
      entityType: 'contact',
      entityId: id,
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.contacts.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Contact was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.contact.deleted',
      entityType: 'contact',
      entityId: id,
    });
    return { success: true };
  }

  private async assertCompany(organisationId: string, companyId?: string) {
    if (!companyId) {
      return;
    }
    const company = await this.companies.findById(organisationId, companyId);
    if (!company) {
      throw new NotFoundException('Company was not found.');
    }
  }
}
