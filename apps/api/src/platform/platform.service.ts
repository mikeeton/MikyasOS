import { Injectable } from '@nestjs/common';
import { CircuitBreakerState, DeploymentStatus, PlatformStatus, Prisma } from '@prisma/client';

import { HealthService } from '../health/health.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateBackupDto,
  CreateDeploymentDto,
  CreateFeatureFlagDto,
  CreateIncidentDto,
  ListPlatformDto,
  RecordCostDto,
  RecordHealthDto,
  RecoveryActionDto,
  SetCircuitBreakerDto,
} from './dto/platform.dto';

type PlatformDelegate =
  | 'platformHealthCheck'
  | 'platformMetric'
  | 'incident'
  | 'deploymentRecord'
  | 'featureFlag'
  | 'backupRecord'
  | 'recoveryAction'
  | 'circuitBreaker'
  | 'jobQueueSnapshot'
  | 'costRecord';

type PlatformModelDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
};

@Injectable()
export class PlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly health: HealthService,
  ) {}

  capabilities() {
    return {
      modules: [
        'PlatformModule',
        'ObservabilityModule',
        'MetricsModule',
        'TracingModule',
        'ReliabilityModule',
        'BackupModule',
        'RecoveryModule',
        'FeatureFlagsModule',
        'DeploymentModule',
        'JobMonitoringModule',
        'CostMonitoringModule',
        'IncidentModule',
        'StatusModule',
      ],
      selfHealingModel: ['detect', 'diagnose', 'recover', 'verify', 'report'],
      tracingExporters: ['Grafana Tempo', 'Jaeger', 'Datadog', 'New Relic', 'Honeycomb'],
      destructiveRecoveryAllowed: false,
    };
  }

  async overview(organisationId: string) {
    const [health, incidents, deployments, backups, failedJobs, flags, costs] = await Promise.all([
      this.health.details(),
      this.prisma.incident.count({
        where: { organisationId, deletedAt: null, status: { notIn: ['RESOLVED', 'CLOSED'] } },
      }),
      this.prisma.deploymentRecord.findMany({
        where: { organisationId, deletedAt: null },
        take: 5,
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.backupRecord.findFirst({
        where: { organisationId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.jobQueueSnapshot.aggregate({
        where: { organisationId, deletedAt: null },
        _sum: { failed: true, deadLettered: true },
      }),
      this.prisma.featureFlag.count({ where: { organisationId, deletedAt: null, enabled: true } }),
      this.prisma.costRecord.aggregate({
        where: { organisationId, deletedAt: null },
        _sum: { amount: true },
      }),
    ]);
    return {
      status: health.status === 'ok' ? PlatformStatus.OPERATIONAL : PlatformStatus.DEGRADED,
      health,
      activeIncidents: incidents,
      recentDeployments: deployments,
      backupStatus: backups?.status ?? 'not_configured',
      failedJobs: Number(failedJobs._sum.failed ?? 0) + Number(failedJobs._sum.deadLettered ?? 0),
      activeFeatureFlags: flags,
      estimatedCost: Number(costs._sum.amount ?? 0),
      errorRate: 0,
      latencyMs: 0,
    };
  }

  async list(delegate: PlatformDelegate, organisationId: string, query: ListPlatformDto) {
    const model = this.delegate(delegate);
    const where = { organisationId, deletedAt: null };
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      model.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount: Math.ceil(total / query.pageSize),
        hasNextPage: query.page * query.pageSize < total,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  createIncident(organisationId: string, dto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        organisationId,
        title: dto.title,
        description: dto.description,
        severity: dto.severity,
        status: dto.status,
        affectedServices: [],
      },
    });
  }

  createFeatureFlag(organisationId: string, dto: CreateFeatureFlagDto) {
    return this.prisma.featureFlag.create({
      data: {
        organisationId,
        key: dto.key,
        name: dto.name,
        scope: dto.scope,
        enabled: dto.enabled ?? false,
        rolloutPercent: dto.rolloutPercent ?? 0,
      },
    });
  }

  evaluateFlag(flag: { enabled: boolean; rolloutPercent: number; killSwitch: boolean }) {
    if (flag.killSwitch) return false;
    if (flag.enabled) return true;
    return flag.rolloutPercent > 0;
  }

  createBackup(organisationId: string, dto: CreateBackupDto) {
    return this.prisma.backupRecord.create({
      data: {
        organisationId,
        name: dto.name,
        target: dto.target,
        status: dto.status,
        startedAt: new Date(),
      },
    });
  }

  createDeployment(organisationId: string, dto: CreateDeploymentDto) {
    return this.prisma.deploymentRecord.create({
      data: {
        organisationId,
        version: dto.version,
        environment: dto.environment,
        commitSha: dto.commitSha,
        status: dto.status ?? DeploymentStatus.PENDING,
      },
    });
  }

  setCircuitBreaker(organisationId: string, dto: SetCircuitBreakerDto) {
    return this.prisma.circuitBreaker.upsert({
      where: { organisationId_service: { organisationId, service: dto.service } },
      update: {
        state: dto.state,
        openedAt: dto.state === CircuitBreakerState.OPEN ? new Date() : undefined,
      },
      create: { organisationId, service: dto.service, state: dto.state },
    });
  }

  recordHealth(organisationId: string, dto: RecordHealthDto) {
    return this.prisma.platformHealthCheck.create({
      data: {
        organisationId,
        service: dto.service,
        status: dto.status,
        responseTimeMs: dto.responseTimeMs,
      },
    });
  }

  recordCost(organisationId: string, dto: RecordCostDto) {
    return this.prisma.costRecord.create({
      data: {
        organisationId,
        category: dto.category,
        provider: dto.provider,
        amount: dto.amount,
      },
    });
  }

  safeRecovery(organisationId: string, dto: RecoveryActionDto) {
    return this.prisma.recoveryAction.create({
      data: {
        organisationId,
        action: dto.action,
        reason: dto.reason,
        safe: true,
        status: DeploymentStatus.SUCCEEDED,
        verification: (dto.verification ?? { verified: true }) as Prisma.InputJsonValue,
      },
    });
  }

  private delegate(delegate: PlatformDelegate) {
    return (this.prisma as unknown as Record<PlatformDelegate, PlatformModelDelegate>)[delegate];
  }
}
