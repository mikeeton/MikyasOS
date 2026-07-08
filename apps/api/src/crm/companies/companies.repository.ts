import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { BulkDeleteDto } from '../dto/bulk-delete.dto';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { UpdateCompanyDto } from './dto/update-company.dto';

const companySortFields = new Set(['name', 'createdAt', 'updatedAt', 'status', 'country', 'city']);

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = companySortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: {
          tags: { include: { tag: true } },
          _count: { select: { contacts: true, leads: true, opportunities: true, notes: true } },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.company.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        contacts: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        leads: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        opportunities: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        notes: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        files: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        tags: { include: { tag: true } },
        activities: { take: 50, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  create(organisationId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: { ...dto, organisationId },
    });
  }

  update(organisationId: string, id: string, dto: UpdateCompanyDto) {
    return this.prisma.company.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: dto,
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.company.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  bulkDelete(organisationId: string, dto: BulkDeleteDto) {
    return this.prisma.company.updateMany({
      where: { id: { in: dto.ids }, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(organisationId: string, query: ListCrmRecordsDto): Prisma.CompanyWhereInput {
    const search = query.search?.trim();

    return {
      organisationId,
      deletedAt: null,
      ...(query.status ? { status: query.status as Prisma.EnumCompanyStatusFilter['equals'] } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { legalName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { website: { contains: search, mode: 'insensitive' } },
              { industry: { contains: search, mode: 'insensitive' } },
              { country: { contains: search, mode: 'insensitive' } },
              { city: { contains: search, mode: 'insensitive' } },
              { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
            ],
          }
        : {}),
    };
  }
}
