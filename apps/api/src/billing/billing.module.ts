import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule],
  controllers: [BillingController],
  providers: [BillingService, JwtAuthGuard, OrganisationGuard, PermissionsGuard],
  exports: [BillingService],
})
export class BillingModule {}

export class SubscriptionModule {}
export class PlanModule {}
export class UsageModule {}
export class CustomerPortalModule {}
export class CheckoutModule {}
