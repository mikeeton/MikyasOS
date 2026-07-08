import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateOpportunityDto } from './dto/create-opportunity.dto';
import type { UpdateOpportunityDto } from './dto/update-opportunity.dto';

const opportunitySortFields = new Set([
  'createdAt',
  'updatedAt',
  'stage',
  'status',
  'probability',
  'expectedCloseDate',
]);

@Injectable()
export class OpportunitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = opportunitySortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: { company: true, ownerUser: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.opportunity.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        company: true,
        ownerUser: { select: { id: true, name: true, email: true } },
        activities: { take: 50, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  create(organisationId: string, dto: CreateOpportunityDto) {
    return this.prisma.opportunity.create({
      data: {
        ...dto,
        organisationId,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
      },
    });
  }

  update(organisationId: string, id: string, dto: UpdateOpportunityDto) {
    return this.prisma.opportunity.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: {
        ...dto,
        expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
      },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.opportunity.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(
    organisationId: string,
    query: ListCrmRecordsDto,
  ): Prisma.OpportunityWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(query.status
        ? { status: query.status as Prisma.EnumOpportunityStatusFilter['equals'] }
        : {}),
      ...(search
        ? {
            OR: [
              { company: { name: { contains: search, mode: 'insensitive' } } },
              { ownerUser: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }
}
