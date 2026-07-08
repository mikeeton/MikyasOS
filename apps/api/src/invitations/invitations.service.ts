import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuthService } from '../auth/auth.service';
import { PasswordService } from '../auth/password.service';
import { TokenService } from '../auth/token.service';
import { PrismaService } from '../infra/database/prisma.service';
import type { AcceptInvitationDto } from './dto/accept-invitation.dto';
import type { InviteUserDto } from './dto/invite-user.dto';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly passwords: PasswordService,
    private readonly auth: AuthService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async invite(organisationId: string, invitedById: string, dto: InviteUserDto) {
    const token = this.tokens.createOpaqueToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const invitation = await this.prisma.invitation.create({
      data: {
        organisationId,
        invitedById,
        roleId: dto.roleId,
        email: dto.email.toLowerCase(),
        tokenHash: this.tokens.hashToken(token),
        expiresAt,
      },
    });

    await this.auditLogs.record({
      organisationId,
      actorUserId: invitedById,
      action: 'invitation.created',
      entityType: 'invitation',
      entityId: invitation.id,
      metadata: { email: invitation.email },
    });

    return { invitation, token };
  }

  async accept(dto: AcceptInvitationDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash: this.tokens.hashToken(dto.token) },
      include: { role: true },
    });

    if (
      !invitation ||
      invitation.status !== InvitationStatus.PENDING ||
      invitation.expiresAt < new Date()
    ) {
      throw new NotFoundException('Invitation was not found.');
    }

    let user = await this.prisma.user.findUnique({ where: { email: invitation.email } });

    if (!user) {
      if (!dto.name || !dto.password) {
        throw new BadRequestException('Name and password are required for new invitees.');
      }

      user = await this.prisma.user.create({
        data: {
          email: invitation.email,
          name: dto.name,
          passwordHash: await this.passwords.hashPassword(dto.password),
        },
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.organisationMember.upsert({
        where: {
          organisationId_userId: {
            organisationId: invitation.organisationId,
            userId: user.id,
          },
        },
        update: {
          roleId: invitation.roleId,
          roleType: invitation.role.type,
          deletedAt: null,
        },
        create: {
          organisationId: invitation.organisationId,
          userId: user.id,
          roleId: invitation.roleId,
          roleType: invitation.role.type,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedById: user.id,
          acceptedAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { activeOrganisationId: invitation.organisationId },
      });
    });

    await this.auditLogs.record({
      organisationId: invitation.organisationId,
      actorUserId: user.id,
      action: 'invitation.accepted',
      entityType: 'invitation',
      entityId: invitation.id,
    });

    return this.auth.issueAuthResponse(user);
  }
}
