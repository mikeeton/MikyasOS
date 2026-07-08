import { UnauthorizedException } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

const createContext = (authorization?: string) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: { authorization } }),
    }),
  }) as never;

describe('JwtAuthGuard', () => {
  it('rejects requests without a bearer token', async () => {
    const guard = new JwtAuthGuard(
      { verifyAsync: jest.fn() } as never,
      { jwtSecret: 'secret' } as never,
    );

    await expect(guard.canActivate(createContext())).rejects.toThrow(UnauthorizedException);
  });

  it('accepts a valid bearer token', async () => {
    const jwt = { verifyAsync: jest.fn().mockResolvedValue({ id: 'user-id' }) };
    const guard = new JwtAuthGuard(jwt as never, { jwtSecret: 'secret' } as never);

    await expect(guard.canActivate(createContext('Bearer token'))).resolves.toBe(true);
    expect(jwt.verifyAsync).toHaveBeenCalledWith('token', { secret: 'secret' });
  });
});
