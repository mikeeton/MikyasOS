import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CashFlowDirection,
  FinanceDocumentStatus,
  FinancialReportType,
  PaymentStatus,
  Prisma,
  QuoteStatus,
  TransactionType,
} from '@prisma/client';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../infra/database/prisma.service';
import type {
  CreateBudgetDto,
  CreateCashFlowEntryDto,
  CreateExpenseDto,
  CreateInvoiceDto,
  CreatePaymentDto,
  CreatePurchaseOrderDto,
  CreateQuoteDto,
  CreateSimpleFinanceDto,
  FinanceItemDto,
  ListFinanceDto,
  ReportQueryDto,
  UpdateFinanceDto,
} from './dto/finance.dto';

type FinanceDelegate =
  | 'invoice'
  | 'quote'
  | 'payment'
  | 'expense'
  | 'purchaseOrder'
  | 'budget'
  | 'cashFlowEntry'
  | 'financialReport'
  | 'account'
  | 'taxRate'
  | 'currency'
  | 'subscription'
  | 'recurringInvoice'
  | 'transaction'
  | 'expenseCategory';

type FinanceRecord = { id: string };

type FinanceModelDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
  findFirst(args: unknown): Promise<FinanceRecord | null>;
  create(args: unknown): Promise<FinanceRecord>;
  update(args: unknown): Promise<unknown>;
};

const SEARCH_FIELDS: Partial<Record<FinanceDelegate, string[]>> = {
  invoice: ['invoiceNumber', 'notes'],
  quote: ['quoteNumber', 'notes'],
  payment: ['reference', 'notes'],
  expense: ['title', 'vendor', 'notes'],
  purchaseOrder: ['orderNumber', 'notes'],
  budget: ['name', 'department'],
  cashFlowEntry: ['description'],
  financialReport: ['name'],
  account: ['name', 'institution'],
  taxRate: ['name', 'country', 'region'],
  currency: ['code', 'name'],
  subscription: ['name'],
  recurringInvoice: ['name'],
  transaction: ['description', 'reference'],
  expenseCategory: ['name', 'description'],
};

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogsService,
  ) {}

  capabilities() {
    return {
      modules: [
        'FinanceModule',
        'InvoicesModule',
        'QuotesModule',
        'PaymentsModule',
        'ExpensesModule',
        'PurchaseOrdersModule',
        'BudgetsModule',
        'CashFlowModule',
        'TaxModule',
        'CurrenciesModule',
        'ReportsModule',
      ],
      reports: [
        'Profit & Loss',
        'Revenue',
        'Expenses',
        'Cash Flow',
        'Tax Summary',
        'Customer Revenue',
        'Project Profitability',
        'Department Spend',
      ],
      integrations: {
        stripe: 'future',
        paypal: 'future',
        accountingSystems: 'future',
        pdfExport: 'prepared',
        emailDelivery: 'placeholder',
      },
    };
  }

  async dashboard(organisationId: string) {
    const [invoices, payments, expenses, budgets, cashFlowEntries, transactions] =
      await this.prisma.$transaction([
        this.prisma.invoice.findMany({ where: { organisationId, deletedAt: null } }),
        this.prisma.payment.findMany({ where: { organisationId, deletedAt: null } }),
        this.prisma.expense.findMany({ where: { organisationId, deletedAt: null } }),
        this.prisma.budget.findMany({ where: { organisationId, deletedAt: null } }),
        this.prisma.cashFlowEntry.findMany({ where: { organisationId, deletedAt: null } }),
        this.prisma.transaction.findMany({
          where: { organisationId, deletedAt: null },
          orderBy: { occurredAt: 'desc' },
          take: 10,
        }),
      ]);

    const revenue = this.sum(invoices.map((invoice) => invoice.total));
    const amountPaid = this.sum(payments.map((payment) => payment.amount));
    const expenseTotal = this.sum(expenses.map((expense) => expense.total));
    const outstanding = this.sum(invoices.map((invoice) => invoice.balance));
    const overdue = invoices.filter(
      (invoice) =>
        invoice.dueDate &&
        invoice.dueDate < new Date() &&
        invoice.status !== FinanceDocumentStatus.PAID &&
        invoice.status !== FinanceDocumentStatus.VOID,
    );
    const cashIn = this.sum(
      cashFlowEntries
        .filter((entry) => entry.direction === CashFlowDirection.INFLOW)
        .map((entry) => entry.amount),
    );
    const cashOut = this.sum(
      cashFlowEntries
        .filter((entry) => entry.direction === CashFlowDirection.OUTFLOW)
        .map((entry) => entry.amount),
    );

    return {
      revenue,
      amountPaid,
      expenses: expenseTotal,
      profit: revenue - expenseTotal,
      outstandingInvoices: outstanding,
      overdueInvoices: overdue.length,
      upcomingPayments: invoices.filter(
        (invoice) => invoice.dueDate && invoice.dueDate > new Date(),
      ).length,
      cashFlow: cashIn - cashOut,
      budgetUtilisation: budgets.map((budget) => ({
        id: budget.id,
        name: budget.name,
        amount: Number(budget.amount),
        spent: Number(budget.spent),
        utilisation: Number(budget.amount) > 0 ? Number(budget.spent) / Number(budget.amount) : 0,
      })),
      recentTransactions: transactions,
      aiFinancialInsights: {
        status: 'prepared',
        note: 'Financial insight services are scaffolded without LLM generation.',
      },
    };
  }

  async list(delegate: FinanceDelegate, organisationId: string, query: ListFinanceDto) {
    const model = this.getDelegate(delegate);
    const page = query.page;
    const pageSize = query.pageSize;
    const where = this.buildWhere(delegate, organisationId, query);
    const orderBy = this.buildOrder(query);
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      }),
      model.count({ where }),
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

  async findOne(delegate: FinanceDelegate, organisationId: string, id: string) {
    const item = await this.getDelegate(delegate).findFirst({
      where: { id, organisationId, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Finance record was not found.');
    return item;
  }

  async createInvoice(organisationId: string, actorUserId: string, dto: CreateInvoiceDto) {
    const items = dto.items ?? [];
    const totals = this.calculateItems(items);
    const invoice = await this.prisma.invoice.create({
      data: {
        organisationId,
        customerId: dto.customerId,
        projectId: dto.projectId,
        invoiceNumber: dto.invoiceNumber ?? (await this.nextNumber(organisationId, 'INV')),
        status: dto.status ?? FinanceDocumentStatus.DRAFT,
        currency: dto.currency ?? 'USD',
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        amountPaid: 0,
        balance: totals.total,
        issueDate: new Date(dto.issueDate),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        notes: dto.notes,
        items: { create: this.mapItems(organisationId, items) },
      },
      include: { items: true, customer: { select: { id: true, name: true } }, project: true },
    });
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.invoice.created',
      'invoice',
      invoice.id,
    );
    return invoice;
  }

  async createQuote(organisationId: string, actorUserId: string, dto: CreateQuoteDto) {
    const items = dto.items ?? [];
    const totals = this.calculateItems(items);
    const quote = await this.prisma.quote.create({
      data: {
        organisationId,
        customerId: dto.customerId,
        projectId: dto.projectId,
        quoteNumber: dto.quoteNumber ?? (await this.nextNumber(organisationId, 'QTE')),
        status: dto.status ?? QuoteStatus.DRAFT,
        currency: dto.currency ?? 'USD',
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        notes: dto.notes,
        items: { create: this.mapItems(organisationId, items) },
      },
      include: { items: true, customer: { select: { id: true, name: true } }, project: true },
    });
    await this.recordAudit(organisationId, actorUserId, 'finance.quote.created', 'quote', quote.id);
    return quote;
  }

  async createPayment(organisationId: string, actorUserId: string, dto: CreatePaymentDto) {
    if (dto.amount <= 0) throw new BadRequestException('Payment amount must be greater than zero.');
    const payment = await this.prisma.payment.create({
      data: {
        organisationId,
        invoiceId: dto.invoiceId,
        customerId: dto.customerId,
        method: dto.method,
        status: dto.status,
        currency: dto.currency ?? 'USD',
        amount: dto.amount,
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
        reference: dto.reference,
      },
    });
    if (dto.invoiceId && payment.status === PaymentStatus.COMPLETED) {
      await this.recalculateInvoiceBalance(organisationId, dto.invoiceId);
    }
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.payment.created',
      'payment',
      payment.id,
    );
    return payment;
  }

  async createExpense(organisationId: string, actorUserId: string, dto: CreateExpenseDto) {
    const total = dto.amount + (dto.tax ?? 0);
    const expense = await this.prisma.expense.create({
      data: {
        organisationId,
        categoryId: dto.categoryId,
        customerId: dto.customerId,
        projectId: dto.projectId,
        title: dto.title,
        vendor: dto.vendor,
        status: dto.status,
        amount: dto.amount,
        tax: dto.tax ?? 0,
        total,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
      },
    });
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.expense.created',
      'expense',
      expense.id,
    );
    return expense;
  }

  async createPurchaseOrder(
    organisationId: string,
    actorUserId: string,
    dto: CreatePurchaseOrderDto,
  ) {
    const items = dto.items ?? [];
    const totals = this.calculateItems(items);
    const order = await this.prisma.purchaseOrder.create({
      data: {
        organisationId,
        supplierId: dto.supplierId,
        projectId: dto.projectId,
        orderNumber: dto.orderNumber ?? (await this.nextNumber(organisationId, 'PO')),
        status: dto.status,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        items: { create: this.mapItems(organisationId, items) },
      },
      include: { items: true },
    });
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.purchase_order.created',
      'purchaseOrder',
      order.id,
    );
    return order;
  }

  async createBudget(organisationId: string, actorUserId: string, dto: CreateBudgetDto) {
    if (new Date(dto.periodEnd) <= new Date(dto.periodStart)) {
      throw new BadRequestException('Budget period end must be after period start.');
    }
    const budget = await this.prisma.budget.create({
      data: {
        organisationId,
        projectId: dto.projectId,
        name: dto.name,
        amount: dto.amount,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
      },
    });
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.budget.created',
      'budget',
      budget.id,
    );
    return budget;
  }

  async createCashFlowEntry(
    organisationId: string,
    actorUserId: string,
    dto: CreateCashFlowEntryDto,
  ) {
    const entry = await this.prisma.cashFlowEntry.create({
      data: {
        organisationId,
        customerId: dto.customerId,
        projectId: dto.projectId,
        direction: dto.direction,
        amount: dto.amount,
        expectedDate: new Date(dto.expectedDate),
        description: dto.description,
      },
    });
    await this.recordAudit(
      organisationId,
      actorUserId,
      'finance.cashflow.created',
      'cashFlowEntry',
      entry.id,
    );
    return entry;
  }

  async createSimple(
    delegate: FinanceDelegate,
    organisationId: string,
    actorUserId: string,
    dto: CreateSimpleFinanceDto,
  ) {
    const model = this.getDelegate(delegate);
    const data = this.simpleData(delegate, organisationId, dto);
    const created = await model.create({ data });
    await this.recordAudit(
      organisationId,
      actorUserId,
      `finance.${delegate}.created`,
      delegate,
      created.id,
    );
    return created;
  }

  async update(
    delegate: FinanceDelegate,
    organisationId: string,
    actorUserId: string,
    id: string,
    dto: UpdateFinanceDto,
  ) {
    await this.findOne(delegate, organisationId, id);
    const data = { ...(dto.data ?? dto) };
    delete data.data;
    const updated = await this.getDelegate(delegate).update({ where: { id }, data });
    await this.recordAudit(
      organisationId,
      actorUserId,
      `finance.${delegate}.updated`,
      delegate,
      id,
    );
    return updated;
  }

  async remove(delegate: FinanceDelegate, organisationId: string, actorUserId: string, id: string) {
    await this.findOne(delegate, organisationId, id);
    await this.getDelegate(delegate).update({ where: { id }, data: { deletedAt: new Date() } });
    await this.recordAudit(
      organisationId,
      actorUserId,
      `finance.${delegate}.deleted`,
      delegate,
      id,
    );
    return { success: true };
  }

  async reports(organisationId: string, query: ReportQueryDto) {
    const dashboard = await this.dashboard(organisationId);
    return {
      type: query.type ?? FinancialReportType.PROFIT_AND_LOSS,
      periodStart: query.periodStart,
      periodEnd: query.periodEnd,
      reports: {
        profitAndLoss: {
          revenue: dashboard.revenue,
          expenses: dashboard.expenses,
          profit: dashboard.profit,
        },
        revenue: { total: dashboard.revenue, paid: dashboard.amountPaid },
        expenses: { total: dashboard.expenses },
        cashFlow: { net: dashboard.cashFlow },
        taxSummary: { status: 'prepared', note: 'Tax rate and tax summary models are available.' },
        customerRevenue: { status: 'prepared' },
        projectProfitability: { status: 'prepared' },
        departmentSpend: { status: 'prepared' },
      },
    };
  }

  private getDelegate(delegate: FinanceDelegate) {
    return (this.prisma as unknown as Record<FinanceDelegate, FinanceModelDelegate>)[delegate];
  }

  private buildWhere(delegate: FinanceDelegate, organisationId: string, query: ListFinanceDto) {
    const where: Record<string, unknown> = { organisationId, deletedAt: null };
    if (query.status) where.status = query.status;
    const fields = SEARCH_FIELDS[delegate] ?? [];
    if (query.search && fields.length) {
      where.OR = fields.map((field) => ({
        [field]: { contains: query.search, mode: 'insensitive' },
      }));
    }
    return where;
  }

  private buildOrder(query: ListFinanceDto) {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection = query.sortDirection ?? 'desc';
    return { [sortBy]: sortDirection };
  }

  private calculateItems(items: FinanceItemDto[]) {
    const lines = items.map((item) => {
      const lineSubtotal = item.quantity * item.unitPrice;
      const discount = item.discount ?? 0;
      const taxable = Math.max(lineSubtotal - discount, 0);
      const tax = taxable * ((item.taxRate ?? 0) / 100);
      return { subtotal: lineSubtotal, discount, tax, total: taxable + tax };
    });
    return {
      subtotal: this.round(lines.reduce((sum, line) => sum + line.subtotal, 0)),
      discount: this.round(lines.reduce((sum, line) => sum + line.discount, 0)),
      tax: this.round(lines.reduce((sum, line) => sum + line.tax, 0)),
      total: this.round(lines.reduce((sum, line) => sum + line.total, 0)),
    };
  }

  private mapItems(organisationId: string, items: FinanceItemDto[]) {
    return items.map((item, position) => {
      const totals = this.calculateItems([item]);
      return {
        organisationId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate ?? 0,
        discount: item.discount ?? 0,
        total: totals.total,
        position,
      };
    });
  }

  private async nextNumber(organisationId: string, prefix: 'INV' | 'QTE' | 'PO') {
    const countMap = {
      INV: () => this.prisma.invoice.count({ where: { organisationId } }),
      QTE: () => this.prisma.quote.count({ where: { organisationId } }),
      PO: () => this.prisma.purchaseOrder.count({ where: { organisationId } }),
    };
    const count = await countMap[prefix]();
    return `${prefix}-${String(count + 1).padStart(5, '0')}`;
  }

  private async recalculateInvoiceBalance(organisationId: string, invoiceId: string) {
    const [invoice, payments] = await this.prisma.$transaction([
      this.prisma.invoice.findFirst({ where: { id: invoiceId, organisationId, deletedAt: null } }),
      this.prisma.payment.findMany({
        where: { invoiceId, organisationId, deletedAt: null, status: PaymentStatus.COMPLETED },
      }),
    ]);
    if (!invoice) return;
    const amountPaid = this.sum(payments.map((payment) => payment.amount));
    const balance = Math.max(Number(invoice.total) - amountPaid, 0);
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid,
        balance,
        status:
          balance === 0
            ? FinanceDocumentStatus.PAID
            : amountPaid > 0
              ? FinanceDocumentStatus.PARTIALLY_PAID
              : invoice.status,
        paidDate: balance === 0 ? new Date() : invoice.paidDate,
      },
    });
  }

  private simpleData(
    delegate: FinanceDelegate,
    organisationId: string,
    dto: CreateSimpleFinanceDto,
  ) {
    const base = { organisationId, metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue };
    switch (delegate) {
      case 'account':
        return { ...base, name: dto.name ?? 'Operating account', type: dto.type ?? 'BANK' };
      case 'taxRate':
        return { organisationId, name: dto.name ?? 'Standard tax', rate: 0 };
      case 'currency':
        return {
          organisationId,
          code: dto.name ?? 'USD',
          name: dto.title ?? 'US Dollar',
          symbol: '$',
        };
      case 'subscription':
        return {
          ...base,
          name: dto.name ?? 'Subscription',
          status: dto.subscriptionStatus ?? 'ACTIVE',
          interval: dto.frequency ?? 'MONTHLY',
        };
      case 'recurringInvoice':
        return {
          ...base,
          name: dto.name ?? 'Recurring invoice',
          frequency: dto.frequency ?? 'MONTHLY',
        };
      case 'transaction':
        return {
          ...base,
          type: dto.transactionType ?? TransactionType.INCOME,
          amount: 0,
          description: dto.name ?? 'Manual transaction',
        };
      case 'expenseCategory':
        return { organisationId, name: dto.name ?? 'General' };
      default:
        return base;
    }
  }

  private async recordAudit(
    organisationId: string,
    actorUserId: string,
    action: string,
    entityType: string,
    entityId?: string,
  ) {
    await this.audit.record({ organisationId, actorUserId, action, entityType, entityId });
    await this.prisma.financeAudit.create({
      data: { organisationId, actorUserId, action, entityType, entityId },
    });
  }

  private sum(values: Array<Prisma.Decimal | number>) {
    return this.round(values.reduce<number>((total, value) => total + Number(value), 0));
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}
