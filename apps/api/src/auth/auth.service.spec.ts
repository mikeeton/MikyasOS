import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';

const createService = () => {
  const users = {
    findByEmailWithPassword: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };
  const passwords = {
    verifyPassword: jest.fn(),
    hashPassword: jest.fn(),
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('access-token') };
  const config = { jwtSecret: 'secret', jwtExpiresIn: '15m', jwtRefreshExpiresInDays: 30 };
  const prisma = {
    user: { update: jest.fn() },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const tokens = {
    createOpaqueToken: jest.fn().mockReturnValue('refresh-token'),
    hashToken: jest.fn((token: string) => `hashed-${token}`),
  };
  const sessions = {
    create: jest.fn().mockResolvedValue({ id: 'session-id' }),
    revoke: jest.fn(),
  };
  const organisations = { switchActive: jest.fn() };
  const auditLogs = { record: jest.fn() };
  const service = new AuthService(
    users as never,
    passwords,
    jwt as never,
    config as never,
    prisma as never,
    tokens,
    sessions as never,
    organisations as never,
    auditLogs as never,
  );

  return { service, users, passwords, prisma, sessions, auditLogs };
};

describe('AuthService', () => {
  it('rejects invalid login without revealing which credential failed', async () => {
    const { service, users } = createService();
    users.findByEmailWithPassword.mockResolvedValue(null);

    await expect(service.login({ email: 'person@example.com', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('creates a session and refresh token on successful login', async () => {
    const { service, users, passwords, prisma, sessions, auditLogs } = createService();
    users.findByEmailWithPassword.mockResolvedValue({
      id: 'user-id',
      email: 'person@example.com',
      name: 'Person',
      passwordHash: 'hash',
      status: 'ACTIVE',
      deletedAt: null,
      activeOrganisationId: 'org-id',
    });
    passwords.verifyPassword.mockResolvedValue(true);

    const result = await service.login({ email: 'person@example.com', password: 'valid-password' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(sessions.create).toHaveBeenCalledWith('user-id', 'org-id', expect.any(Date));
    const refreshTokenCreate = prisma.refreshToken.create as jest.MockedFunction<
      (input: { data: { tokenHash: string } }) => void
    >;
    const refreshCreatePayload = refreshTokenCreate.mock.calls[0]?.[0];
    if (!refreshCreatePayload) {
      throw new Error('Expected refresh token creation payload.');
    }
    expect(refreshCreatePayload.data.tokenHash).toBe('hashed-refresh-token');
    expect(auditLogs.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'auth.login', actorUserId: 'user-id' }),
    );
  });
});
