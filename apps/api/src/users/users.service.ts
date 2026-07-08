import { ConflictException, Injectable } from '@nestjs/common';

import { PasswordService } from '../auth/password.service';
import { PrismaService } from '../infra/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        activeOrganisationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async create(email: string, name: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existing) {
      throw new ConflictException('An account already exists for this email.');
    }

    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash: await this.passwords.hashPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        activeOrganisationId: true,
        createdAt: true,
      },
    });
  }
}
