import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { ContactsRepository } from '../contacts/contacts.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { CustomerNotesRepository } from './customer-notes.repository';
import type { CreateCustomerNoteDto } from './dto/create-customer-note.dto';

@Injectable()
export class CustomerNotesService {
  constructor(
    private readonly notes: CustomerNotesRepository,
    private readonly companies: CompaniesRepository,
    private readonly contacts: ContactsRepository,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.notes.list(organisationId, query);
  }

  async create(organisationId: string, actorUserId: string, dto: CreateCustomerNoteDto) {
    await this.assertTarget(organisationId, dto.companyId, dto.contactId);
    const note = await this.notes.create(organisationId, actorUserId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: note.companyId,
      contactId: note.contactId,
      type: CustomerActivityType.NOTE_ADDED,
      title: 'Note added',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.note.created',
      entityType: 'customerNote',
      entityId: note.id,
    });
    return note;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.notes.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Note was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.note.deleted',
      entityType: 'customerNote',
      entityId: id,
    });
    return { success: true };
  }

  private async assertTarget(organisationId: string, companyId?: string, contactId?: string) {
    if (!companyId && !contactId) {
      throw new BadRequestException('A company or contact is required.');
    }
    if (companyId && !(await this.companies.findById(organisationId, companyId))) {
      throw new NotFoundException('Company was not found.');
    }
    if (contactId && !(await this.contacts.findById(organisationId, contactId))) {
      throw new NotFoundException('Contact was not found.');
    }
  }
}
