import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import { getPagination, toPaginatedResult } from '../crm-pagination';
import type { ListCrmRecordsDto } from '../dto/list-crm-records.dto';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';

const contactSortFields = new Set(['firstName', 'lastName', 'createdAt', 'updatedAt', 'email']);

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(organisationId: string, query: ListCrmRecordsDto) {
    const { page, pageSize, skip, take } = getPagination(query);
    const where = this.buildWhere(organisationId, query);
    const sortBy = contactSortFields.has(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contact.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: query.sortDirection },
        include: { company: true },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  findById(organisationId: string, id: string) {
    return this.prisma.contact.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: {
        company: true,
        customerNotes: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        files: { where: { deletedAt: null }, take: 25, orderBy: { createdAt: 'desc' } },
        activities: { take: 50, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  create(organisationId: string, dto: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        ...dto,
        organisationId,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      },
    });
  }

  update(organisationId: string, id: string, dto: UpdateContactDto) {
    return this.prisma.contact.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: {
        ...dto,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.contact.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhere(organisationId: string, query: ListCrmRecordsDto): Prisma.ContactWhereInput {
    const search = query.search?.trim();
    return {
      organisationId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { mobile: { contains: search, mode: 'insensitive' } },
              { jobTitle: { contains: search, mode: 'insensitive' } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }
}
