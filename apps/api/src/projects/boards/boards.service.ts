import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../infra/database/prisma.service';
import { WorkRelationsService } from '../common/work-relations.service';
import type { CreateBoardColumnDto } from './dto/create-board-column.dto';
import type { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relations: WorkRelationsService,
  ) {}

  list(organisationId: string, projectId?: string) {
    return this.prisma.projectBoard.findMany({
      where: { organisationId, deletedAt: null, ...(projectId ? { projectId } : {}) },
      include: {
        columns: { orderBy: { position: 'asc' } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(organisationId: string, dto: CreateBoardDto) {
    await this.relations.assertProject(organisationId, dto.projectId);
    return this.prisma.projectBoard.create({
      data: { organisationId, projectId: dto.projectId, name: dto.name },
      include: { columns: true },
    });
  }

  async createColumn(organisationId: string, dto: CreateBoardColumnDto) {
    const board = await this.prisma.projectBoard.findFirst({
      where: { id: dto.boardId, organisationId, deletedAt: null },
    });
    if (!board) throw new NotFoundException('Board was not found.');
    return this.prisma.projectBoardColumn.create({ data: dto });
  }

  async remove(organisationId: string, id: string) {
    const result = await this.prisma.projectBoard.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) throw new NotFoundException('Board was not found.');
    return { success: true };
  }
}
