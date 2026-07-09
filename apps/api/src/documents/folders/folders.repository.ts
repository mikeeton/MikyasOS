import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';
import type { CreateFolderDto } from '../dto/create-folder.dto';
import type { UpdateFolderDto } from '../dto/update-folder.dto';

@Injectable()
export class FoldersRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(organisationId: string, parentFolderId?: string) {
    return this.prisma.folder.findMany({
      where: { organisationId, parentFolderId: parentFolderId ?? null, deletedAt: null },
      orderBy: [{ name: 'asc' }],
      include: { _count: { select: { childFolders: true, documents: true } } },
    });
  }

  findById(organisationId: string, id: string) {
    return this.prisma.folder.findFirst({
      where: { id, organisationId, deletedAt: null },
      include: { parentFolder: true, childFolders: { where: { deletedAt: null } } },
    });
  }

  create(
    organisationId: string,
    ownerId: string,
    dto: CreateFolderDto,
    hierarchy: { path: string; depth: number },
  ) {
    return this.prisma.folder.create({
      data: {
        organisationId,
        ownerId,
        parentFolderId: dto.parentFolderId,
        name: dto.name,
        description: dto.description,
        path: hierarchy.path,
        depth: hierarchy.depth,
        colour: dto.colour,
        icon: dto.icon,
        visibility: dto.visibility,
      },
    });
  }

  update(
    organisationId: string,
    id: string,
    dto: UpdateFolderDto,
    hierarchy?: { path: string; depth: number },
  ) {
    const data: Prisma.FolderUpdateManyMutationInput = {
      name: dto.name,
      description: dto.description,
      colour: dto.colour,
      icon: dto.icon,
      visibility: dto.visibility,
      ...(hierarchy ? { path: hierarchy.path, depth: hierarchy.depth } : {}),
    };

    return this.prisma.folder.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: {
        ...data,
        ...(Object.prototype.hasOwnProperty.call(dto, 'parentFolderId')
          ? { parentFolderId: dto.parentFolderId ?? null }
          : {}),
      },
    });
  }

  softDelete(organisationId: string, id: string) {
    return this.prisma.folder.updateMany({
      where: { id, organisationId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
