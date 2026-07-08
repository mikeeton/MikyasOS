import { Injectable } from '@nestjs/common';
import type { CustomerActivityType, Prisma } from '@prisma/client';

import { PrismaService } from '../infra/database/prisma.service';

type RecordActivityInput = {
  organisationId: string;
  actorUserId?: string | null;
  companyId?: string | null;
  contactId?: string | null;
  leadId?: string | null;
  opportunityId?: string | null;
  type: CustomerActivityType;
  title: string;
  description?: string | null;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class CustomerActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: RecordActivityInput) {
    return this.prisma.customerActivity.create({
      data: {
        organisationId: input.organisationId,
        actorUserId: input.actorUserId,
        companyId: input.companyId,
        contactId: input.contactId,
        leadId: input.leadId,
        opportunityId: input.opportunityId,
        type: input.type,
        title: input.title,
        description: input.description,
        metadata: input.metadata,
      },
    });
  }

  listForCompany(organisationId: string, companyId: string) {
    return this.prisma.customerActivity.findMany({
      where: { organisationId, companyId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
