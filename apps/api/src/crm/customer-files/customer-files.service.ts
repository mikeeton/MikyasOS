import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { ContactsRepository } from '../contacts/contacts.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateCustomerFileDto } from './dto/create-customer-file.dto';
import { CustomerFilesRepository } from './customer-files.repository';

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Injectable()
export class CustomerFilesService {
  constructor(
    private readonly files: CustomerFilesRepository,
    private readonly companies: CompaniesRepository,
    private readonly contacts: ContactsRepository,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.files.list(organisationId, query);
  }

  async create(organisationId: string, actorUserId: string, dto: CreateCustomerFileDto) {
    await this.assertTarget(organisationId, dto);
    const file = await this.files.create(organisationId, actorUserId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: file.companyId,
      contactId: file.contactId,
      type: CustomerActivityType.FILE_UPLOADED,
      title: 'File metadata added',
      description: file.originalFilename,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.file.created',
      entityType: 'customerFile',
      entityId: file.id,
    });
    return file;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.files.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('File was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.file.deleted',
      entityType: 'customerFile',
      entityId: id,
    });
    return { success: true };
  }

  private async assertTarget(organisationId: string, dto: CreateCustomerFileDto) {
    if (!dto.companyId && !dto.contactId) {
      throw new BadRequestException('A company or contact is required.');
    }
    if (!allowedMimeTypes.has(dto.mimeType)) {
      throw new BadRequestException('File type is not allowed.');
    }
    if (dto.companyId && !(await this.companies.findById(organisationId, dto.companyId))) {
      throw new NotFoundException('Company was not found.');
    }
    if (dto.contactId && !(await this.contacts.findById(organisationId, dto.contactId))) {
      throw new NotFoundException('Contact was not found.');
    }
  }
}
