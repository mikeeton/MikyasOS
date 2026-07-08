import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import type { SignOptions } from 'jsonwebtoken';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AppConfigService } from '../config/app-config.service';
import { PrismaService } from '../infra/database/prisma.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly sessions: SessionsService,
    private readonly organisations: OrganisationsService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.create(dto.email, dto.name, dto.password);
    await this.auditLogs.record({
      actorUserId: user.id,
      action: 'auth.registered',
      entityType: 'user',
      entityId: user.id,
    });
    return this.issueAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmailWithPassword(dto.email);

    if (
      !user ||
      user.deletedAt ||
      !(await this.passwords.verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('This account is not active.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.auditLogs.record({
      organisationId: user.activeOrganisationId,
      actorUserId: user.id,
      action: 'auth.login',
      entityType: 'user',
      entityId: user.id,
    });

    return this.issueAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.tokens.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true, session: true },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt < new Date() ||
      stored.session.revokedAt ||
      stored.user.deletedAt
    ) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const nextRefreshToken = this.tokens.createOpaqueToken();
    const nextRefreshTokenHash = this.tokens.hashToken(nextRefreshToken);
    const expiresAt = this.refreshExpiry();

    const next = await this.prisma.refreshToken.create({
      data: {
        userId: stored.userId,
        organisationId: stored.organisationId,
        sessionId: stored.sessionId,
        tokenHash: nextRefreshTokenHash,
        expiresAt,
      },
    });

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date(), replacedById: next.id },
    });

    return {
      accessToken: await this.signAccessToken(stored.user, stored.sessionId),
      refreshToken: nextRefreshToken,
      expiresAt,
    };
  }

  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.sessions.revoke(sessionId);
      await this.prisma.refreshToken.updateMany({
        where: { sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await this.auditLogs.record({
      actorUserId: userId,
      action: 'auth.logout',
      entityType: 'user',
      entityId: userId,
    });

    return { success: true };
  }

  async switchOrganisation(userId: string, organisationId: string) {
    const user = await this.organisations.switchActive(userId, organisationId);
    await this.auditLogs.record({
      organisationId,
      actorUserId: userId,
      action: 'organisation.switched',
      entityType: 'organisation',
      entityId: organisationId,
    });
    return this.issueAuthResponse(user);
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User was not found.');
    }
    return user;
  }

  async issueAuthResponse(user: Pick<User, 'id' | 'email' | 'name' | 'activeOrganisationId'>) {
    const expiresAt = this.refreshExpiry();
    const session = await this.sessions.create(user.id, user.activeOrganisationId, expiresAt);
    const refreshToken = this.tokens.createOpaqueToken();

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        organisationId: user.activeOrganisationId,
        sessionId: session.id,
        tokenHash: this.tokens.hashToken(refreshToken),
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        activeOrganisationId: user.activeOrganisationId,
      },
      accessToken: await this.signAccessToken(user, session.id),
      refreshToken,
      expiresAt,
    };
  }

  private signAccessToken(
    user: Pick<User, 'id' | 'email' | 'activeOrganisationId'>,
    sessionId: string,
  ) {
    return this.jwt.signAsync(
      {
        id: user.id,
        sub: user.id,
        email: user.email,
        activeOrganisationId: user.activeOrganisationId,
        sessionId,
      },
      {
        secret: this.config.jwtSecret,
        expiresIn: this.config.jwtExpiresIn as SignOptions['expiresIn'],
      },
    );
  }

  private refreshExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.config.jwtRefreshExpiresInDays);
    return expiresAt;
  }
}
