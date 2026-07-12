import { Injectable } from '@nestjs/common';
import {
  BillingInterval,
  BillingProvider,
  CheckoutStatus,
  EmailTemplateType,
  LegalDocumentType,
  OnboardingStatus,
  PlanTier,
  Prisma,
  SaasSubscriptionStatus,
  UsageMetric,
} from '@prisma/client';

import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateCheckoutDto,
  CreateDataExportDto,
  CreateDataImportDto,
  CreatePlanDto,
  CreateSubscriptionDto,
  ListBillingDto,
  RecordUsageDto,
  UpdateCheckoutStatusDto,
  UpdateOnboardingDto,
} from './dto/billing.dto';

type BillingPageDelegate = {
  findMany(args: {
    where: { organisationId: string; deletedAt: null };
    skip: number;
    take: number;
    orderBy: { createdAt: 'desc' };
  }): Promise<unknown[]>;
  count(args: { where: { organisationId: string; deletedAt: null } }): Promise<number>;
};

const PLAN_CATALOG: Array<
  CreatePlanDto & { monthlyPrice: number; annualPrice: number; features: string[] }
> = [
  {
    tier: PlanTier.STARTER,
    name: 'Starter',
    description: 'For small teams launching their first operating workspace.',
    monthlyPrice: 29,
    annualPrice: 290,
    maxUsers: 5,
    storageGb: 25,
    aiTokensMonthly: 100000,
    automationsMonthly: 500,
    projectsLimit: 20,
    documentsLimit: 1000,
    apiAccess: false,
    supportLevel: 'Email support',
    enterpriseFeatures: false,
    features: ['CRM', 'Projects', 'Documents', 'Basic AI', 'Standard onboarding'],
  },
  {
    tier: PlanTier.PROFESSIONAL,
    name: 'Professional',
    description: 'For growing teams that need deeper automation and AI usage.',
    monthlyPrice: 79,
    annualPrice: 790,
    maxUsers: 20,
    storageGb: 100,
    aiTokensMonthly: 500000,
    automationsMonthly: 5000,
    projectsLimit: 100,
    documentsLimit: 10000,
    apiAccess: true,
    supportLevel: 'Priority email support',
    enterpriseFeatures: false,
    features: ['Advanced CRM', 'Automation', 'Finance', 'Analytics', 'API access'],
  },
  {
    tier: PlanTier.BUSINESS,
    name: 'Business',
    description: 'For operating companies standardising teams and workflows.',
    monthlyPrice: 199,
    annualPrice: 1990,
    maxUsers: 100,
    storageGb: 500,
    aiTokensMonthly: 2000000,
    automationsMonthly: 50000,
    projectsLimit: 500,
    documentsLimit: 100000,
    apiAccess: true,
    supportLevel: 'Priority support and launch guidance',
    enterpriseFeatures: true,
    features: ['Enterprise controls', 'Integrations', 'Advanced analytics', 'Usage governance'],
  },
  {
    tier: PlanTier.ENTERPRISE,
    name: 'Enterprise',
    description: 'For larger organisations that need governance, SSO and compliance controls.',
    monthlyPrice: 0,
    annualPrice: 0,
    maxUsers: 10000,
    storageGb: 5000,
    aiTokensMonthly: 20000000,
    automationsMonthly: 1000000,
    projectsLimit: 10000,
    documentsLimit: 1000000,
    apiAccess: true,
    supportLevel: 'Dedicated success and security review',
    enterpriseFeatures: true,
    features: ['SSO architecture', 'Directory sync', 'Compliance controls', 'Custom contract'],
  },
];

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  capabilities() {
    return {
      providers: [BillingProvider.STRIPE, BillingProvider.PADDLE, BillingProvider.LEMON_SQUEEZY],
      paymentArchitecture: {
        monthlyBilling: true,
        annualBilling: true,
        freeTrial: true,
        coupons: true,
        proration: true,
        taxes: 'prepared',
        refunds: 'architecture_ready',
        productionProviderConnected: false,
      },
      usageMetrics: Object.values(UsageMetric),
      dataPortability: ['CSV', 'Excel', 'PDF', 'JSON', 'Organisation backup'],
    };
  }

  planCatalog() {
    return PLAN_CATALOG;
  }

  async overview(organisationId: string) {
    const [subscription, usage, invoices, onboarding, imports, exports] = await Promise.all([
      this.prisma.saasSubscription.findFirst({
        where: { organisationId, deletedAt: null },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usageRecord.findMany({
        where: { organisationId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.billingInvoice.findMany({
        where: { organisationId, deletedAt: null },
        orderBy: { issuedAt: 'desc' },
        take: 5,
      }),
      this.prisma.onboardingProgress.findUnique({ where: { organisationId } }),
      this.prisma.dataImport.count({ where: { organisationId, deletedAt: null } }),
      this.prisma.dataExport.count({ where: { organisationId, deletedAt: null } }),
    ]);

    return {
      subscription,
      plan: subscription?.plan ?? PLAN_CATALOG[0],
      usage,
      invoices,
      onboarding,
      imports,
      exports,
      support: {
        level: subscription?.plan?.supportLevel ?? 'Email support',
        portalPrepared: true,
        statusPagePrepared: true,
      },
    };
  }

  async createPlan(organisationId: string | null, dto: CreatePlanDto) {
    const existing = await this.prisma.plan.findFirst({
      where: { organisationId, tier: dto.tier, deletedAt: null },
    });

    if (existing) {
      return this.prisma.plan.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.plan.create({
      data: {
        ...dto,
        organisationId,
        monthlyPrice: 0,
        annualPrice: 0,
        features: [],
      },
    });
  }

  async createSubscription(organisationId: string, dto: CreateSubscriptionDto) {
    return this.prisma.saasSubscription.create({
      data: {
        organisationId,
        planId: dto.planId,
        provider: dto.provider ?? BillingProvider.MANUAL,
        status: dto.status ?? SaasSubscriptionStatus.TRIALING,
        interval: dto.interval ?? BillingInterval.MONTHLY,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  subscriptions(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.saasSubscription, organisationId, query);
  }

  async createCheckout(organisationId: string, dto: CreateCheckoutDto) {
    return this.prisma.checkoutSession.create({
      data: {
        organisationId,
        planId: dto.planId,
        provider: dto.provider ?? BillingProvider.MANUAL,
        interval: dto.interval ?? BillingInterval.MONTHLY,
        status: CheckoutStatus.OPEN,
        successUrl: dto.successUrl,
        cancelUrl: dto.cancelUrl,
        couponCode: dto.couponCode,
        checkoutUrl: `/app/billing/checkout/placeholder/${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  checkoutSessions(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.checkoutSession, organisationId, query);
  }

  updateCheckoutStatus(organisationId: string, id: string, dto: UpdateCheckoutStatusDto) {
    return this.prisma.checkoutSession.update({
      where: { id, organisationId },
      data: { status: dto.status },
    });
  }

  createPortalSession(organisationId: string, returnUrl?: string) {
    return this.prisma.customerPortalSession.create({
      data: {
        organisationId,
        provider: BillingProvider.MANUAL,
        returnUrl,
        portalUrl: `/app/billing/portal/placeholder/${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  portalSessions(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.customerPortalSession, organisationId, query);
  }

  async recordUsage(organisationId: string, dto: RecordUsageDto) {
    const now = new Date();
    return this.prisma.usageRecord.create({
      data: {
        organisationId,
        metric: dto.metric,
        quantity: dto.quantity,
        limit: dto.limit,
        source: dto.source,
        periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
        periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      },
    });
  }

  usage(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.usageRecord, organisationId, query);
  }

  async upsertOnboarding(organisationId: string, dto: UpdateOnboardingDto) {
    const completed = dto.status === OnboardingStatus.COMPLETED;
    const checklist = dto.checklist as Prisma.InputJsonValue | undefined;

    return this.prisma.onboardingProgress.upsert({
      where: { organisationId },
      update: {
        ...dto,
        checklist,
        completedAt: completed ? new Date() : undefined,
      },
      create: {
        organisationId,
        status: dto.status ?? OnboardingStatus.IN_PROGRESS,
        currentStep: dto.currentStep ?? 'create-organisation',
        completedSteps: [],
        checklist,
        sampleWorkspace: dto.sampleWorkspace ?? false,
        aiIntroduced: dto.aiIntroduced ?? false,
        completedAt: completed ? new Date() : undefined,
      },
    });
  }

  onboarding(organisationId: string) {
    return this.prisma.onboardingProgress.findUnique({ where: { organisationId } });
  }

  createImport(organisationId: string, userId: string, dto: CreateDataImportDto) {
    return this.prisma.dataImport.create({
      data: { organisationId, createdBy: userId, ...dto },
    });
  }

  imports(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.dataImport, organisationId, query);
  }

  createExport(organisationId: string, userId: string, dto: CreateDataExportDto) {
    return this.prisma.dataExport.create({
      data: { organisationId, requestedBy: userId, ...dto },
    });
  }

  exports(organisationId: string, query: ListBillingDto) {
    return this.paginate(this.prisma.dataExport, organisationId, query);
  }

  emailTemplates() {
    return Object.values(EmailTemplateType).map((type) => ({
      type,
      subject: this.emailSubject(type),
      variables: ['organisationName', 'userName', 'actionUrl'],
      status: 'template_ready',
    }));
  }

  legalDocuments() {
    return Object.values(LegalDocumentType).map((type) => ({
      type,
      version: 'v1.0.0',
      status: 'draft_ready',
      requiresLegalReview: true,
    }));
  }

  launchChecklist() {
    return [
      'Authentication',
      'CRM',
      'Projects',
      'Documents',
      'AI',
      'Communication',
      'Automation',
      'Finance',
      'Analytics',
      'Integrations',
      'Enterprise',
      'Subscriptions',
      'Customer onboarding',
      'Billing',
      'Marketing website',
      'Performance',
      'Accessibility',
      'Security',
      'Production deployment',
    ].map((title) => ({ title, status: 'verification_required' }));
  }

  private async paginate(
    delegate: BillingPageDelegate,
    organisationId: string,
    query: ListBillingDto,
  ) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const where = { organisationId, deletedAt: null };
    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  private emailSubject(type: EmailTemplateType) {
    const subjects: Record<EmailTemplateType, string> = {
      WELCOME: 'Welcome to mikyasOS',
      INVITATION: 'You have been invited to mikyasOS',
      PASSWORD_RESET: 'Reset your mikyasOS password',
      VERIFICATION: 'Verify your mikyasOS account',
      INVOICE: 'Your mikyasOS invoice',
      TRIAL_ENDING: 'Your mikyasOS trial is ending soon',
      SUBSCRIPTION_UPGRADED: 'Your mikyasOS subscription was upgraded',
      SUBSCRIPTION_CANCELLED: 'Your mikyasOS subscription was cancelled',
    };

    return subjects[type];
  }
}
