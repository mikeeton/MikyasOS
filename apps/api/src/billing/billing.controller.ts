import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { BillingService } from './billing.service';
import {
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

@Controller({ path: 'billing', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('capabilities')
  @RequirePermissions('Billing.Read')
  capabilities() {
    return this.billing.capabilities();
  }

  @Get('overview')
  @RequirePermissions('Billing.Read')
  overview(@CurrentOrganisation() organisationId: string) {
    return this.billing.overview(organisationId);
  }

  @Get('plans')
  @RequirePermissions('Billing.Read')
  plans() {
    return this.billing.planCatalog();
  }

  @Post('plans')
  @RequirePermissions('Billing.Manage')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.billing.createPlan(null, dto);
  }

  @Get('subscriptions')
  @RequirePermissions('Billing.Read')
  subscriptions(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.subscriptions(organisationId, query);
  }

  @Post('subscriptions')
  @RequirePermissions('Billing.Manage')
  createSubscription(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.billing.createSubscription(organisationId, dto);
  }

  @Get('checkout')
  @RequirePermissions('Billing.Read')
  checkoutSessions(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.checkoutSessions(organisationId, query);
  }

  @Post('checkout')
  @RequirePermissions('Billing.Manage')
  createCheckout(@CurrentOrganisation() organisationId: string, @Body() dto: CreateCheckoutDto) {
    return this.billing.createCheckout(organisationId, dto);
  }

  @Patch('checkout/:id')
  @RequirePermissions('Billing.Manage')
  updateCheckout(
    @CurrentOrganisation() organisationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCheckoutStatusDto,
  ) {
    return this.billing.updateCheckoutStatus(organisationId, id, dto);
  }

  @Get('portal')
  @RequirePermissions('Billing.Read')
  portalSessions(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.portalSessions(organisationId, query);
  }

  @Post('portal')
  @RequirePermissions('Billing.Manage')
  createPortalSession(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: { returnUrl?: string },
  ) {
    return this.billing.createPortalSession(organisationId, dto.returnUrl);
  }

  @Get('usage')
  @RequirePermissions('Billing.Read')
  usage(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.usage(organisationId, query);
  }

  @Post('usage')
  @RequirePermissions('Billing.Manage')
  recordUsage(@CurrentOrganisation() organisationId: string, @Body() dto: RecordUsageDto) {
    return this.billing.recordUsage(organisationId, dto);
  }

  @Get('onboarding')
  @RequirePermissions('Billing.Read')
  onboarding(@CurrentOrganisation() organisationId: string) {
    return this.billing.onboarding(organisationId);
  }

  @Post('onboarding')
  @RequirePermissions('Billing.Manage')
  updateOnboarding(
    @CurrentOrganisation() organisationId: string,
    @Body() dto: UpdateOnboardingDto,
  ) {
    return this.billing.upsertOnboarding(organisationId, dto);
  }

  @Get('imports')
  @RequirePermissions('Billing.Read')
  imports(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.imports(organisationId, query);
  }

  @Post('imports')
  @RequirePermissions('Billing.Manage')
  createImport(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDataImportDto,
  ) {
    return this.billing.createImport(organisationId, user.id, dto);
  }

  @Get('exports')
  @RequirePermissions('Billing.Read')
  exports(@CurrentOrganisation() organisationId: string, @Query() query: ListBillingDto) {
    return this.billing.exports(organisationId, query);
  }

  @Post('exports')
  @RequirePermissions('Billing.Manage')
  createExport(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDataExportDto,
  ) {
    return this.billing.createExport(organisationId, user.id, dto);
  }

  @Get('emails/templates')
  @RequirePermissions('Billing.Read')
  emailTemplates() {
    return this.billing.emailTemplates();
  }

  @Get('legal')
  @RequirePermissions('Billing.Read')
  legalDocuments() {
    return this.billing.legalDocuments();
  }

  @Get('launch-checklist')
  @RequirePermissions('Billing.Read')
  launchChecklist() {
    return this.billing.launchChecklist();
  }
}
