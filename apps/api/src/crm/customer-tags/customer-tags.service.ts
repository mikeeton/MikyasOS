import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import { CustomerTagsRepository } from './customer-tags.repository';
import type { AssignCustomerTagDto } from './dto/assign-customer-tag.dto';
import type { CreateCustomerTagDto } from './dto/create-customer-tag.dto';

@Injectable()
export class CustomerTagsService {
  constructor(
    private readonly tags: CustomerTagsRepository,
    private readonly companies: CompaniesRepository,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string) {
    return this.tags.list(organisationId);
  }

  async create(organisationId: string, actorUserId: string, dto: CreateCustomerTagDto) {
    const tag = await this.tags.create(organisationId, dto);
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.tag.created',
      entityType: 'customerTag',
      entityId: tag.id,
    });
    return tag;
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.tags.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Tag was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.tag.deleted',
      entityType: 'customerTag',
      entityId: id,
    });
    return { success: true };
  }

  async assign(organisationId: string, actorUserId: string, dto: AssignCustomerTagDto) {
    await this.assertCompanyAndTag(organisationId, dto);
    const assignment = await this.tags.assign(dto.companyId, dto.tagId);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: dto.companyId,
      type: CustomerActivityType.TAG_CHANGED,
      title: 'Tag assigned',
      metadata: { tagId: dto.tagId },
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.tag.assigned',
      entityType: 'companyTag',
      entityId: assignment.id,
      metadata: { companyId: dto.companyId, tagId: dto.tagId },
    });
    return assignment;
  }

  async unassign(organisationId: string, actorUserId: string, dto: AssignCustomerTagDto) {
    await this.assertCompanyAndTag(organisationId, dto);
    const result = await this.tags.unassign(dto.companyId, dto.tagId);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: dto.companyId,
      type: CustomerActivityType.TAG_CHANGED,
      title: 'Tag removed',
      metadata: { tagId: dto.tagId },
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.tag.unassigned',
      entityType: 'companyTag',
      metadata: { companyId: dto.companyId, tagId: dto.tagId, count: result.count },
    });
    return { removed: result.count };
  }

  private async assertCompanyAndTag(organisationId: string, dto: AssignCustomerTagDto) {
    const [company, tag] = await Promise.all([
      this.companies.findById(organisationId, dto.companyId),
      this.tags.findById(organisationId, dto.tagId),
    ]);
    if (!company) {
      throw new NotFoundException('Company was not found.');
    }
    if (!tag) {
      throw new NotFoundException('Tag was not found.');
    }
  }
}
