import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerActivityType } from '@prisma/client';

import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { CompaniesRepository } from '../companies/companies.repository';
import { CustomerActivitiesService } from '../customer-activities.service';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateLeadDto } from './dto/create-lead.dto';
import type { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leads: LeadsRepository,
    private readonly companies: CompaniesRepository,
    private readonly prisma: PrismaService,
    private readonly activities: CustomerActivitiesService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  list(organisationId: string, query: ListCrmRecordsDto) {
    return this.leads.list(organisationId, query);
  }

  async findOne(organisationId: string, id: string) {
    const lead = await this.leads.findById(organisationId, id);
    if (!lead) {
      throw new NotFoundException('Lead was not found.');
    }
    return lead;
  }

  async create(organisationId: string, actorUserId: string, dto: CreateLeadDto) {
    await this.assertRelations(organisationId, dto.companyId, dto.assignedTo);
    const lead = await this.leads.create(organisationId, dto);
    await this.activities.record({
      organisationId,
      actorUserId,
      companyId: lead.companyId,
      leadId: lead.id,
      type: CustomerActivityType.LEAD_CREATED,
      title: 'Lead created',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.lead.created',
      entityType: 'lead',
      entityId: lead.id,
    });
    return lead;
  }

  async update(organisationId: string, actorUserId: string, id: string, dto: UpdateLeadDto) {
    await this.assertRelations(organisationId, dto.companyId, dto.assignedTo);
    const result = await this.leads.update(organisationId, id, dto);
    if (result.count === 0) {
      throw new NotFoundException('Lead was not found.');
    }
    await this.activities.record({
      organisationId,
      actorUserId,
      leadId: id,
      companyId: dto.companyId,
      type: CustomerActivityType.LEAD_UPDATED,
      title: 'Lead updated',
    });
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.lead.updated',
      entityType: 'lead',
      entityId: id,
    });
    return this.findOne(organisationId, id);
  }

  async remove(organisationId: string, actorUserId: string, id: string) {
    const result = await this.leads.softDelete(organisationId, id);
    if (result.count === 0) {
      throw new NotFoundException('Lead was not found.');
    }
    await this.auditLogs.record({
      organisationId,
      actorUserId,
      action: 'crm.lead.deleted',
      entityType: 'lead',
      entityId: id,
    });
    return { success: true };
  }

  private async assertRelations(organisationId: string, companyId?: string, assignedTo?: string) {
    if (companyId && !(await this.companies.findById(organisationId, companyId))) {
      throw new NotFoundException('Company was not found.');
    }
    if (assignedTo) {
      const member = await this.prisma.organisationMember.findFirst({
        where: { organisationId, userId: assignedTo, deletedAt: null },
      });
      if (!member) {
        throw new NotFoundException('Assignee was not found.');
      }
    }
  }
}
