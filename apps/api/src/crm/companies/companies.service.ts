import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { BulkDeleteDto } from '../dto/bulk-delete.dto';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import { CompaniesRepository } from './companies.repository';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companies: CompaniesRepository,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.companies.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const company = await this.companies.findById(organisationId, id);
    if (!company) {
      throw new NotFoundException('Company was not found.');
    }
    return company;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateCompanyDto) {
    const company = await this.companies.create(organisationId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: company.id,
      type: CustomerActivityType.COMPANY_CREATED,
      title: 'Company created',
      description: company.name,
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.company.created',
      entityType: 'company',
      entityId: company.id,
    });
    return company;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateCompanyDto) {
    const result = await this.companies.update(organisationId, id, dto);
    if (result.count === 0) {
      throw new NotFoundException('Company was not found.');
    }
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: id,
      type: CustomerActivityType.COMPANY_UPDATED,
      title: 'Company updated',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.company.updated',
      entityType: 'company',
      entityId: id,
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.companies.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Company was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.company.deleted',
      entityType: 'company',
      entityId: id,
    });
    return { success: true };
  }

  async bulkDelete(organisationId: string, actorUserId: string, dto: BulkDeleteDto) {
    const result = await this.companies.bulkDelete(organisationId, dto);
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.company.bulk_deleted',
      entityType: 'company',
      metadata: { ids: dto.ids, count: result.count },
    });
    return { deleted: result.count };
  }
}
