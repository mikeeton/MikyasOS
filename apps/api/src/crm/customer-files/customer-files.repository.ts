import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateCustomerFileDto } from './dto/create-customer-file.dto';

@Injectable()
export class CustomerFilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.customerFile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: query.sortDirection },
        include: {
          company: true,
          contact: true,
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.customerFile.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  create(organisationId: string, uploadedById: string, dto: CreateCustomerFileDto) {
    return this.prisma.customerFile.create({
      data: { ...dto, organisationId, uploadedById },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.customerFile.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(
    organisationId: string,
    query: ListCrmRecordsDto,
  ): Prisma.CustomerFileWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { originalFilename: { contains: search, mode: 'insensitive' } },
              { mimeType: { contains: search, mode: 'insensitive' } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
              { contact: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }
}
