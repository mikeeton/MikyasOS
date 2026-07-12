import {
  BillingInterval,
  CheckoutStatus,
  DataFormat,
  OnboardingStatus,
  UsageMetric,
} from '@prisma/client';

import { BillingService } from './billing.service';

describe('BillingService', () => {
  function service() {
    const prisma = {
      saasSubscription: {
        findFirst: jest.fn().mockResolvedValue({ id: 'sub-id', plan: { name: 'Business' } }),
        create: jest.fn().mockResolvedValue({ id: 'sub-id' }),
        findMany: jest.fn().mockResolvedValue([{ id: 'sub-id' }]),
        count: jest.fn().mockResolvedValue(1),
      },
      usageRecord: {
        findMany: jest.fn().mockResolvedValue([{ id: 'usage-id' }]),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'usage-id' }),
      },
      billingInvoice: {
        findMany: jest.fn().mockResolvedValue([{ id: 'invoice-id' }]),
      },
      onboardingProgress: {
        findUnique: jest.fn().mockResolvedValue({ status: OnboardingStatus.IN_PROGRESS }),
        upsert: jest.fn().mockResolvedValue({ status: OnboardingStatus.COMPLETED }),
      },
      dataImport: {
        count: jest.fn().mockResolvedValue(2),
        create: jest.fn().mockResolvedValue({ id: 'import-id' }),
        findMany: jest.fn().mockResolvedValue([{ id: 'import-id' }]),
      },
      dataExport: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({ id: 'export-id' }),
        findMany: jest.fn().mockResolvedValue([{ id: 'export-id' }]),
      },
      plan: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'plan-id' }),
      },
      checkoutSession: {
        create: jest.fn().mockResolvedValue({ id: 'checkout-id', status: CheckoutStatus.OPEN }),
        findMany: jest.fn().mockResolvedValue([{ id: 'checkout-id' }]),
        count: jest.fn().mockResolvedValue(1),
        update: jest
          .fn()
          .mockResolvedValue({ id: 'checkout-id', status: CheckoutStatus.COMPLETED }),
      },
      customerPortalSession: {
        create: jest.fn().mockResolvedValue({ id: 'portal-id' }),
        findMany: jest.fn().mockResolvedValue([{ id: 'portal-id' }]),
        count: jest.fn().mockResolvedValue(1),
      },
    };
    return { billing: new BillingService(prisma as never), prisma };
  }

  it('returns production plan and payment capabilities', () => {
    const { billing } = service();

    expect(billing.planCatalog()).toHaveLength(4);
    expect(billing.capabilities().paymentArchitecture.freeTrial).toBe(true);
  });

  it('builds a subscription overview', async () => {
    const { billing } = service();

    const overview = await billing.overview('org-id');

    expect(overview.subscription?.id).toBe('sub-id');
    expect(overview.imports).toBe(2);
    expect(overview.exports).toBe(1);
  });

  it('creates checkout, subscription, usage and onboarding records', async () => {
    const { billing, prisma } = service();

    await billing.createSubscription('org-id', { interval: BillingInterval.ANNUAL });
    await billing.createCheckout('org-id', { interval: BillingInterval.MONTHLY });
    await billing.recordUsage('org-id', { metric: UsageMetric.AI_TOKENS, quantity: 2000 });
    await billing.upsertOnboarding('org-id', { status: OnboardingStatus.COMPLETED });

    expect(prisma.saasSubscription.create).toHaveBeenCalled();
    expect(prisma.checkoutSession.create).toHaveBeenCalled();
    expect(prisma.usageRecord.create).toHaveBeenCalled();
    expect(prisma.onboardingProgress.upsert).toHaveBeenCalled();
  });

  it('creates import and export jobs', async () => {
    const { billing, prisma } = service();

    await billing.createImport('org-id', 'user-id', { type: 'contacts', format: DataFormat.CSV });
    await billing.createExport('org-id', 'user-id', { type: 'backup', format: DataFormat.JSON });

    expect(prisma.dataImport.create).toHaveBeenCalled();
    expect(prisma.dataExport.create).toHaveBeenCalled();
  });
});
