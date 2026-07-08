import { Injectable } from '@nestjs/common';

import { PrismaService } from '../infra/database/prisma.service';
import { RedisService } from '../infra/redis/redis.service';

type HealthStatus = 'ok' | 'degraded' | 'down';

type HealthResponse = {
  status: HealthStatus;
  services: Record<string, HealthStatus>;
  uptime: number;
};

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthResponse> {
    const [database, redis] = await Promise.all([this.checkDatabase(), this.checkRedis()]);
    const services = { database, redis };
    const status = Object.values(services).every((service) => service === 'ok') ? 'ok' : 'degraded';

    return {
      status,
      services,
      uptime: process.uptime(),
    };
  }

  private async checkDatabase(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'ok';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<HealthStatus> {
    try {
      await this.redis.ping();
      return 'ok';
    } catch {
      return 'down';
    }
  }
}
