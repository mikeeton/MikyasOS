import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateLeadDto } from './dto/create-lead.dto';
import type { UpdateLeadDto } from './dto/update-lead.dto';

const leadSortFields = new Set([
  'createdAt',
  'updatedAt',
  'status',
  'probability',
  'expectedCloseDate',
]);

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = leadSortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: { company: true, assignee: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.lead.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
        activities: { take: 50, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  create(organisationId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        organisationId,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
      },
    });
  }

  update(organisationId: string, id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: {
        ...dto,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
      },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.lead.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(organisationId: string, query: ListCrmRecordsDto): Prisma.LeadWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(query.status ? { status: query.status as Prisma.EnumLeadStatusFilter['equals'] } : {}),
      ...(search
        ? {
            OR: [
              { source: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }
}
