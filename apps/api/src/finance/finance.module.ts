import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DatabaseModule } from '../infra/database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { FinanceController } from './finance.controller';
import {
  BudgetRecommendationService,
  CashFlowPredictionService,
  FinancialInsightService,
  InvoiceRiskService,
  RevenueForecastService,
} from './finance-ai.service';
import { FinanceService } from './finance.service';

@Module({
  imports: [DatabaseModule, JwtModule.register({}), PermissionsModule, AuditLogsModule],
  controllers: [FinanceController],
  providers: [
    JwtAuthGuard,
    OrganisationGuard,
    PermissionsGuard,
    FinanceService,
    FinancialInsightService,
    CashFlowPredictionService,
    InvoiceRiskService,
    BudgetRecommendationService,
    RevenueForecastService,
  ],
  exports: [FinanceService],
})
export class FinanceModule {}

export class InvoicesModule {}
export class QuotesModule {}
export class PaymentsModule {}
export class ExpensesModule {}
export class PurchaseOrdersModule {}
export class BudgetsModule {}
export class CashFlowModule {}
export class TaxModule {}
export class CurrenciesModule {}
export class ReportsModule {}
