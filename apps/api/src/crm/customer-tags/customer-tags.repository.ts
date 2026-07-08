import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';
import type { CreateCustomerTagDto } from './dto/create-customer-tag.dto';

@Injectable()
export class CustomerTagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(organisationId: string) {
    return this.prisma.customerTag.findMany({
      where: { organisationId, deletedAt: null },
      include: { _count: { select: { companies: true } } },
      orderBy: { name: 'asc' },
    });
  }

  findById(organisationId: string, id: string) {
    return this.prisma.customerTag.findFirst({ where: { id, organisationId, deletedAt: null } });
  }

  create(organisationId: string, dto: CreateCustomerTagDto) {
    return this.prisma.customerTag.create({ data: { ...dto, organisationId } });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.customerTag.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  assign(companyId: string, tagId: string) {
    return this.prisma.companyTag.upsert({
      where: { companyId_tagId: { companyId, tagId } },
      update: {},
      create: { companyId, tagId },
    });
  }

  unassign(companyId: string, tagId: string) {
    return this.prisma.companyTag.deleteMany({ where: { companyId, tagId } });
  }
}
