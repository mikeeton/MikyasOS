import { BadRequestException } from '@nestjs/common';
import { CashFlowDirection, FinanceDocumentStatus, PaymentStatus } from '@prisma/client';

import { FinanceService } from './finance.service';

describe('FinanceService', () => {
  function service(prismaOverrides: Record<string, unknown> = {}) {
    type InvoiceCreateInput = {
      data: {
        organisationId: string;
        subtotal: number;
        tax: number;
        total: number;
        balance: number;
      };
    };
    const invoiceCreate = jest
      .fn<Promise<{ id: string }>, [InvoiceCreateInput]>()
      .mockResolvedValue({
        id: 'invoice-id',
      });
    const prisma = {
      invoice: {
        count: jest.fn().mockResolvedValue(0),
        create: invoiceCreate,
      },
      financeAudit: { create: jest.fn().mockResolvedValue({ id: 'finance-audit-id' }) },
      ...prismaOverrides,
    };
    const audit = { record: jest.fn().mockResolvedValue({ id: 'audit-id' }) };
    return {
      service: new FinanceService(prisma as never, audit as never),
      prisma,
      audit,
      invoiceCreate,
    };
  }

  it('creates invoices with calculated totals and audit logs', async () => {
    const { service: finance, invoiceCreate, audit } = service();

    await finance.createInvoice('org-id', 'user-id', {
      issueDate: '2026-07-12T00:00:00.000Z',
      items: [{ description: 'Strategy sprint', quantity: 2, unitPrice: 100, taxRate: 10 }],
    });

    const invoiceCreateCall = invoiceCreate.mock.calls[0]?.[0];
    expect(invoiceCreateCall?.data).toEqual(
      expect.objectContaining({
        organisationId: 'org-id',
        subtotal: 200,
        tax: 20,
        total: 220,
        balance: 220,
      }),
    );
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'finance.invoice.created', entityType: 'invoice' }),
    );
  });

  it('rejects zero-value payments', async () => {
    const { service: finance } = service();

    await expect(
      finance.createPayment('org-id', 'user-id', {
        amount: 0,
        status: PaymentStatus.COMPLETED,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects budgets whose period ends before it starts', async () => {
    const { service: finance } = service();

    await expect(
      finance.createBudget('org-id', 'user-id', {
        name: 'Bad budget',
        amount: 100,
        periodStart: '2026-08-01T00:00:00.000Z',
        periodEnd: '2026-07-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('builds dashboard totals from finance records', async () => {
    const { service: finance } = service({
      $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
      invoice: {
        findMany: jest.fn().mockResolvedValue([
          {
            total: 1000,
            balance: 250,
            dueDate: new Date('2026-01-01T00:00:00.000Z'),
            status: FinanceDocumentStatus.SENT,
          },
        ]),
      },
      payment: { findMany: jest.fn().mockResolvedValue([{ amount: 750 }]) },
      expense: { findMany: jest.fn().mockResolvedValue([{ total: 300 }]) },
      budget: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: 'budget-id', name: 'Ops', amount: 1000, spent: 400 }]),
      },
      cashFlowEntry: {
        findMany: jest.fn().mockResolvedValue([
          { direction: CashFlowDirection.INFLOW, amount: 900 },
          { direction: CashFlowDirection.OUTFLOW, amount: 200 },
        ]),
      },
      transaction: { findMany: jest.fn().mockResolvedValue([]) },
    });

    const result = await finance.dashboard('org-id');

    expect(result.revenue).toBe(1000);
    expect(result.expenses).toBe(300);
    expect(result.profit).toBe(700);
    expect(result.cashFlow).toBe(700);
    expect(result.overdueInvoices).toBe(1);
  });
});
