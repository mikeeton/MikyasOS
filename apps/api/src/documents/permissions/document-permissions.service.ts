import { Injectable } from '@nestjs/common';
import { DocumentPermissionLevel } from '@prisma/client';

import { PrismaService } from '../../infra/database/prisma.service';

const permissionRank: Record<DocumentPermissionLevel, number> = {
  VIEW: 1,
  COMMENT: 2,
  EDIT: 3,
  MANAGE: 4,
  OWNER: 5,
};

@Injectable()
export class DocumentPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async userCanAccessDocument(
    organisationId: string,
    userId: string,
    documentId: string,
    required: DocumentPermissionLevel,
  ) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, organisationId, deletedAt: null },
      include: { folder: true },
    });
    if (!document) return false;
    if (document.ownerId === userId) return true;
    if (document.visibility === 'ORGANISATION' && required === DocumentPermissionLevel.VIEW)
      return true;

    const membership = await this.prisma.organisationMember.findFirst({
      where: { organisationId, userId, deletedAt: null },
      select: { roleId: true },
    });

    const grants = await this.prisma.documentPermission.findMany({
      where: {
        organisationId,
        OR: [
          { documentId, userId },
          { documentId, roleId: membership?.roleId },
          { folderId: document.folderId ?? undefined, userId },
          { folderId: document.folderId ?? undefined, roleId: membership?.roleId },
        ],
      },
    });

    return grants.some(
      (grant) => permissionRank[grant.permissionLevel] >= permissionRank[required],
    );
  }
}
