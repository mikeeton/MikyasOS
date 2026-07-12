import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import {
  BudgetRecommendationService,
  CashFlowPredictionService,
  FinancialInsightService,
  InvoiceRiskService,
  RevenueForecastService,
} from './finance-ai.service';
import {
  CreateBudgetDto,
  CreateCashFlowEntryDto,
  CreateExpenseDto,
  CreateInvoiceDto,
  CreatePaymentDto,
  CreatePurchaseOrderDto,
  CreateQuoteDto,
  CreateSimpleFinanceDto,
  IdParamDto,
  ListFinanceDto,
  ReportQueryDto,
  UpdateFinanceDto,
} from './dto/finance.dto';
import { FinanceService } from './finance.service';

@Controller({ path: 'finance', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class FinanceController {
  constructor(
    private readonly finance: FinanceService,
    private readonly insights: FinancialInsightService,
    private readonly cashFlowPrediction: CashFlowPredictionService,
    private readonly invoiceRisk: InvoiceRiskService,
    private readonly budgetRecommendations: BudgetRecommendationService,
    private readonly revenueForecast: RevenueForecastService,
  ) {}

  @Get('capabilities')
  @RequirePermissions('Finance.Read')
  capabilities() {
    return {
      ...this.finance.capabilities(),
      aiPreparation: {
        insights: this.insights.getArchitecture(),
        cashFlowPrediction: this.cashFlowPrediction.getArchitecture(),
        invoiceRisk: this.invoiceRisk.getArchitecture(),
        budgetRecommendations: this.budgetRecommendations.getArchitecture(),
        revenueForecast: this.revenueForecast.getArchitecture(),
      },
    };
  }

  @Get('dashboard')
  @RequirePermissions('Finance.Read')
  dashboard(@CurrentOrganisation() organisationId: string) {
    return this.finance.dashboard(organisationId);
  }

  @Get('reports/summary')
  @RequirePermissions('Finance.Read')
  reports(@CurrentOrganisation() organisationId: string, @Query() query: ReportQueryDto) {
    return this.finance.reports(organisationId, query);
  }

  @Get('invoices')
  @RequirePermissions('Finance.Read')
  invoices(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('invoice', organisationId, query);
  }

  @Get('invoices/:id')
  @RequirePermissions('Finance.Read')
  invoice(@CurrentOrganisation() organisationId: string, @Param() params: IdParamDto) {
    return this.finance.findOne('invoice', organisationId, params.id);
  }

  @Post('invoices')
  @RequirePermissions('Finance.Write')
  createInvoice(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.finance.createInvoice(organisationId, user.id, dto);
  }

  @Patch('invoices/:id')
  @RequirePermissions('Finance.Write')
  updateInvoice(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateFinanceDto,
  ) {
    return this.finance.update('invoice', organisationId, user.id, params.id, dto);
  }

  @Delete('invoices/:id')
  @RequirePermissions('Finance.Manage')
  deleteInvoice(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
  ) {
    return this.finance.remove('invoice', organisationId, user.id, params.id);
  }

  @Get('quotes')
  @RequirePermissions('Finance.Read')
  quotes(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('quote', organisationId, query);
  }

  @Post('quotes')
  @RequirePermissions('Finance.Write')
  createQuote(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateQuoteDto,
  ) {
    return this.finance.createQuote(organisationId, user.id, dto);
  }

  @Get('payments')
  @RequirePermissions('Finance.Read')
  payments(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('payment', organisationId, query);
  }

  @Post('payments')
  @RequirePermissions('Finance.Write')
  createPayment(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.finance.createPayment(organisationId, user.id, dto);
  }

  @Get('expenses')
  @RequirePermissions('Finance.Read')
  expenses(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('expense', organisationId, query);
  }

  @Post('expenses')
  @RequirePermissions('Finance.Write')
  createExpense(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.finance.createExpense(organisationId, user.id, dto);
  }

  @Get('purchase-orders')
  @RequirePermissions('Finance.Read')
  purchaseOrders(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('purchaseOrder', organisationId, query);
  }

  @Post('purchase-orders')
  @RequirePermissions('Finance.Write')
  createPurchaseOrder(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePurchaseOrderDto,
  ) {
    return this.finance.createPurchaseOrder(organisationId, user.id, dto);
  }

  @Get('budgets')
  @RequirePermissions('Finance.Read')
  budgets(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('budget', organisationId, query);
  }

  @Post('budgets')
  @RequirePermissions('Finance.Write')
  createBudget(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBudgetDto,
  ) {
    return this.finance.createBudget(organisationId, user.id, dto);
  }

  @Get('cashflow')
  @RequirePermissions('Finance.Read')
  cashFlow(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('cashFlowEntry', organisationId, query);
  }

  @Post('cashflow')
  @RequirePermissions('Finance.Write')
  createCashFlow(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCashFlowEntryDto,
  ) {
    return this.finance.createCashFlowEntry(organisationId, user.id, dto);
  }

  @Get('reports')
  @RequirePermissions('Finance.Read')
  financialReports(@CurrentOrganisation() organisationId: string, @Query() query: ListFinanceDto) {
    return this.finance.list('financialReport', organisationId, query);
  }

  @Get(':resource')
  @RequirePermissions('Finance.Read')
  listResource(
    @CurrentOrganisation() organisationId: string,
    @Param('resource') resource: string,
    @Query() query: ListFinanceDto,
  ) {
    return this.finance.list(this.mapResource(resource), organisationId, query);
  }

  @Post(':resource')
  @RequirePermissions('Finance.Write')
  createResource(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('resource') resource: string,
    @Body() dto: CreateSimpleFinanceDto,
  ) {
    return this.finance.createSimple(this.mapResource(resource), organisationId, user.id, dto);
  }

  private mapResource(resource: string) {
    const map = {
      accounts: 'account',
      'tax-rates': 'taxRate',
      currencies: 'currency',
      subscriptions: 'subscription',
      'recurring-invoices': 'recurringInvoice',
      transactions: 'transaction',
      'expense-categories': 'expenseCategory',
    } as const;
    const mapped = map[resource as keyof typeof map];
    if (!mapped) throw new NotFoundException('Finance resource was not found.');
    return mapped;
  }
}
