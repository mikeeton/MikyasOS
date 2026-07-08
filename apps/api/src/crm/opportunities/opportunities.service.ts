import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType, OpportunityStatus } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateOpportunityDto } from './dto/create-opportunity.dto';
import type { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunitiesRepository } from './opportunities.repository';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly opportunities: OpportunitiesRepository,
    private readonly companies: CompaniesRepository,
    private readonly prisma: PrismaService,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.opportunities.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const opportunity = await this.opportunities.findById(organisationId, id);
    if (!opportunity) {
      throw new NotFoundException('Opportunity was not found.');
    }
    return opportunity;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateOpportunityDto) {
    await this.assertRelations(organisationId, dto.companyId, dto.owner);
    const opportunity = await this.opportunities.create(organisationId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: opportunity.companyId,
      opportunityId: opportunity.id,
      type: CustomerActivityType.OPPORTUNITY_CREATED,
      title: 'Opportunity created',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.opportunity.created',
      entityType: 'opportunity',
      entityId: opportunity.id,
    });
    return opportunity;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateOpportunityDto) {
    await this.assertRelations(organisationId, dto.companyId, dto.owner);
    const result = await this.opportunities.update(organisationId, id, dto);
    if (result.count === 0) {
      throw new NotFoundException('Opportunity was not found.');
    }
    await this.activities.record({
      organisationId,
      actorUserId,
      opportunityId: id,
      companyId: dto.companyId,
      type:
        dto.status === OpportunityStatus.WON
          ? CustomerActivityType.OPPORTUNITY_WON
          : dto.status === OpportunityStatus.LOST
            ? CustomerActivityType.OPPORTUNITY_LOST
            : CustomerActivityType.OPPORTUNITY_UPDATED,
      title: 'Opportunity updated',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.opportunity.updated',
      entityType: 'opportunity',
      entityId: id,
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.opportunities.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Opportunity was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.opportunity.deleted',
      entityType: 'opportunity',
      entityId: id,
    });
    return { success: true };
  }

  private async assertRelations(organisationId: string, companyId?: string, owner?: string) {
    if (companyId && !(await this.companies.findById(organisationId, companyId))) {
      throw new NotFoundException('Company was not found.');
    }
    if (owner) {
      const member = await this.prisma.organisationMember.findFirst({
        where: { organisationId, userId: owner, deletedAt: null },
      });
      if (!member) {
        throw new NotFoundException('Owner was not found.');
      }
    }
  }
}
