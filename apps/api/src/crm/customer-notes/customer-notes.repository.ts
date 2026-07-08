import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateCustomerNoteDto } from './dto/create-customer-note.dto';

@Injectable()
export class CustomerNotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.customerNote.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: query.sortDirection },
        include: {
          company: true,
          contact: true,
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.customerNote.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  create(organisationId: string, authorId: string, dto: CreateCustomerNoteDto) {
    return this.prisma.customerNote.create({
      data: { ...dto, organisationId, authorId },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.customerNote.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(
    organisationId: string,
    query: ListCrmRecordsDto,
  ): Prisma.CustomerNoteWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(search ? { content: { contains: search, mode: 'insensitive' } } : {}),
    };
  }
}
