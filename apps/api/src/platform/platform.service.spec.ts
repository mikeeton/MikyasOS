import {
  BackupStatus,
  CircuitBreakerState,
  DeploymentStatus,
  FeatureFlagScope,
  IncidentSeverity,
  PlatformStatus,
} from '@prisma/client';

import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  function service() {
    const prisma = {
      incident: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'incident-id' }),
      },
      deploymentRecord: {
        findMany: jest.fn().mockResolvedValue([{ id: 'deployment-id' }]),
        create: jest.fn().mockResolvedValue({ id: 'deployment-id' }),
      },
      backupRecord: {
        findFirst: jest.fn().mockResolvedValue({ status: BackupStatus.VERIFIED }),
        create: jest.fn().mockResolvedValue({ id: 'backup-id' }),
      },
      jobQueueSnapshot: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { failed: 2, deadLettered: 1 } }),
      },
      featureFlag: {
        count: jest.fn().mockResolvedValue(3),
        create: jest.fn().mockResolvedValue({ id: 'flag-id' }),
      },
      costRecord: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 42 } }),
        create: jest.fn().mockResolvedValue({ id: 'cost-id' }),
      },
      circuitBreaker: {
        upsert: jest.fn().mockResolvedValue({ id: 'breaker-id', state: CircuitBreakerState.OPEN }),
      },
      platformHealthCheck: {
        create: jest.fn().mockResolvedValue({ id: 'health-id' }),
      },
      recoveryAction: {
        create: jest.fn().mockResolvedValue({ id: 'recovery-id' }),
      },
    };
    const health = {
      details: jest.fn().mockResolvedValue({ status: 'ok', services: { database: 'ok' } }),
    };
    return { service: new PlatformService(prisma as never, health as never), prisma };
  }

  it('builds an operations overview', async () => {
    const { service: platform } = service();

    const overview = await platform.overview('org-id');

    expect(overview.status).toBe(PlatformStatus.OPERATIONAL);
    expect(overview.failedJobs).toBe(3);
    expect(overview.estimatedCost).toBe(42);
  });

  it('evaluates feature flags and kill switches', () => {
    const { service: platform } = service();

    expect(platform.evaluateFlag({ enabled: true, rolloutPercent: 0, killSwitch: false })).toBe(
      true,
    );
    expect(platform.evaluateFlag({ enabled: true, rolloutPercent: 100, killSwitch: true })).toBe(
      false,
    );
    expect(platform.evaluateFlag({ enabled: false, rolloutPercent: 10, killSwitch: false })).toBe(
      true,
    );
  });

  it('creates incidents, backups, deployments, flags, and circuit breakers', async () => {
    const { service: platform, prisma } = service();

    await platform.createIncident('org-id', {
      title: 'Redis degraded',
      severity: IncidentSeverity.SEV3,
    });
    await platform.createBackup('org-id', { name: 'Daily backup', target: 'postgres' });
    await platform.createDeployment('org-id', {
      version: '2026.07.12',
      environment: 'staging',
      status: DeploymentStatus.SUCCEEDED,
    });
    await platform.createFeatureFlag('org-id', {
      key: 'new-ai-provider',
      name: 'New AI provider',
      scope: FeatureFlagScope.ORGANISATION,
    });
    await platform.setCircuitBreaker('org-id', {
      service: 'openrouter',
      state: CircuitBreakerState.OPEN,
    });

    expect(prisma.incident.create).toHaveBeenCalled();
    expect(prisma.backupRecord.create).toHaveBeenCalled();
    expect(prisma.deploymentRecord.create).toHaveBeenCalled();
    expect(prisma.featureFlag.create).toHaveBeenCalled();
    expect(prisma.circuitBreaker.upsert).toHaveBeenCalled();
  });
});
