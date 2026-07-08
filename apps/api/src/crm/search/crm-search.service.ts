import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';
import type { CrmSearchDto } from './dto/crm-search.dto';

@Injectable()
export class CrmSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(organisationId: string, dto: CrmSearchDto) {
    const query = dto.q.trim();
    const limit = Math.min(dto.limit, 50);

    const [companies, contacts, leads, opportunities, tags] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { website: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } },
            { country: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { tags: { some: { tag: { name: { contains: query, mode: 'insensitive' } } } } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.contact.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { mobile: { contains: query, mode: 'insensitive' } },
            { company: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.lead.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { source: { contains: query, mode: 'insensitive' } },
            { status: { equals: this.toLeadStatus(query) } },
            { company: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.opportunity.findMany({
        where: {
          organisationId,
          deletedAt: null,
          OR: [
            { status: { equals: this.toOpportunityStatus(query) } },
            { company: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.customerTag.findMany({
        where: {
          organisationId,
          deletedAt: null,
          name: { contains: query, mode: 'insensitive' },
        },
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      query,
      architecture: {
        fullTextReady: true,
        vectorReady: true,
      },
      results: {
        companies,
        contacts,
        leads,
        opportunities,
        tags,
      },
    };
  }

  private toLeadStatus(query: string) {
    const normalized = query.trim().toUpperCase().replaceAll(' ', '_');
    return ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST'].includes(
      normalized,
    )
      ? (normalized as 'NEW')
      : undefined;
  }

  private toOpportunityStatus(query: string) {
    const normalized = query.trim().toUpperCase().replaceAll(' ', '_');
    return ['OPEN', 'WON', 'LOST', 'ARCHIVED'].includes(normalized)
      ? (normalized as 'OPEN')
      : undefined;
  }
}
