import { Link } from 'react-router';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  CalendarClock,
  CircleDollarSign,
  CreditCard,
  FileText,
  Plus,
  Receipt,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type {
  Budget,
  CashFlowEntry,
  Expense,
  Invoice,
  Payment,
  PurchaseOrder,
  Quote,
} from '@/api/client';
import {
  useBudgets,
  useCashFlow,
  useCreateExpense,
  useCreateInvoice,
  useCreateQuote,
  useExpenses,
  useFinanceCapabilities,
  useFinanceDashboard,
  useFinanceReportSummary,
  useFinancialReports,
  useInvoices,
  usePayments,
  usePurchaseOrders,
  useQuotes,
} from '../hooks/use-finance';

const financeSubnav: Array<{ to: string; label: string }> = [
  { to: '/app/finance', label: 'Dashboard' },
  { to: '/app/invoices', label: 'Invoices' },
  { to: '/app/quotes', label: 'Quotes' },
  { to: '/app/payments', label: 'Payments' },
  { to: '/app/expenses', label: 'Expenses' },
  { to: '/app/purchase-orders', label: 'Purchase orders' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/budgets', label: 'Budgets' },
  { to: '/app/cashflow', label: 'Cash flow' },
];

function items<T>(data?: { items: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function money(value?: string | number | null, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
    Number(value ?? 0),
  );
}

function FinanceShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Workspace / Finance & Billing</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {financeSubnav.map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button variant="outline" size="sm">
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <section className="premium-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
    </section>
  );
}

function FinanceTable<T extends { id: string }>({
  rows,
  columns,
  empty,
}: {
  rows: T[];
  columns: Array<{ label: string; render: (row: T) => React.ReactNode }>;
  empty: string;
}) {
  return (
    <section className="premium-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {columns.map((column) => (
                  <td key={column.label} className="px-4 py-4">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p className="p-6 text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}

export function FinanceDashboardPage() {
  const dashboard = useFinanceDashboard();
  const capabilities = useFinanceCapabilities();
  const invoices = useInvoices({ pageSize: 5 });
  const expenses = useExpenses({ pageSize: 5 });
  const createInvoice = useCreateInvoice();
  const cashRows: Array<{
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    moneyValue?: boolean;
  }> = [
    { label: 'Revenue', value: dashboard.data?.revenue ?? 0, icon: ArrowUpRight, moneyValue: true },
    {
      label: 'Expenses',
      value: dashboard.data?.expenses ?? 0,
      icon: ArrowDownRight,
      moneyValue: true,
    },
    {
      label: 'Amount paid',
      value: dashboard.data?.amountPaid ?? 0,
      icon: CreditCard,
      moneyValue: true,
    },
    { label: 'Overdue invoices', value: dashboard.data?.overdueInvoices ?? 0, icon: FileText },
  ];
  const createDemoInvoice = () =>
    createInvoice.mutate({
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Demo invoice generated from Finance dashboard.',
      items: [
        {
          description: 'Premium operating system setup',
          quantity: 1,
          unitPrice: 1200,
          taxRate: 20,
        },
      ],
    });

  return (
    <FinanceShell
      title="Finance command centre"
      description="Revenue, invoices, quotes, payments, expenses, budgets, reports, cash flow, and AI-ready financial intelligence."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={money(dashboard.data?.revenue)}
          hint="Invoice revenue across the organisation."
        />
        <StatCard
          icon={Receipt}
          label="Expenses"
          value={money(dashboard.data?.expenses)}
          hint="Approved and recorded spend."
        />
        <StatCard
          icon={CircleDollarSign}
          label="Profit"
          value={money(dashboard.data?.profit)}
          hint="Revenue minus expenses."
        />
        <StatCard
          icon={ClockIcon}
          label="Outstanding"
          value={money(dashboard.data?.outstandingInvoices)}
          hint="Open invoice balance."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={createDemoInvoice} disabled={createInvoice.isPending}>
          <Plus className="mr-2 size-4" />
          Create demo invoice
        </Button>
        <Link to="/app/reports">
          <Button variant="outline">Open reports</Button>
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="premium-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Cash flow</h2>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs">
              Net {money(dashboard.data?.cashFlow)}
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {cashRows.map(({ label, value, icon: Icon, moneyValue }) => (
              <div
                key={String(label)}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Icon className="size-4" />
                  {label}
                </span>
                <span className="font-medium">{moneyValue ? money(value) : String(value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card p-5">
          <h2 className="font-semibold">AI financial insights</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Insight, cash-flow prediction, invoice risk, budget recommendations, and revenue
            forecast services are prepared without LLM generation.
          </p>
          <div className="mt-4 grid gap-2">
            {Object.keys(capabilities.data?.aiPreparation ?? {}).map((key) => (
              <div key={key} className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <Bot className="size-4" />
                {key}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <FinanceTable
          rows={items(invoices.data)}
          empty="No invoices yet. Create one to start tracking revenue."
          columns={[
            { label: 'Invoice', render: (row: Invoice) => row.invoiceNumber },
            { label: 'Status', render: (row) => row.status },
            {
              label: 'Due',
              render: (row) =>
                row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'No due date',
            },
            { label: 'Total', render: (row) => money(row.total, row.currency) },
          ]}
        />
        <FinanceTable
          rows={items(expenses.data)}
          empty="No expenses yet. Record spend to understand margin."
          columns={[
            { label: 'Expense', render: (row: Expense) => row.title },
            { label: 'Vendor', render: (row) => row.vendor ?? 'Unassigned' },
            { label: 'Status', render: (row) => row.status },
            { label: 'Total', render: (row) => money(row.total, row.currency) },
          ]}
        />
      </div>
    </FinanceShell>
  );
}

const ClockIcon = CalendarClock;

export function InvoicesPage() {
  const invoices = useInvoices({ pageSize: 50 });
  const createInvoice = useCreateInvoice();
  return (
    <FinanceShell
      title="Invoices"
      description="Professional invoice builder, payment history, PDF/print/email placeholders, timelines, and CRM/project links."
    >
      <Button
        className="w-fit"
        onClick={() =>
          createInvoice.mutate({
            issueDate: new Date().toISOString(),
            items: [{ description: 'Consulting services', quantity: 1, unitPrice: 500 }],
          })
        }
      >
        <Plus className="mr-2 size-4" />
        New invoice
      </Button>
      <FinanceTable
        rows={items(invoices.data)}
        empty="No invoices yet."
        columns={[
          { label: 'Number', render: (row: Invoice) => row.invoiceNumber },
          { label: 'Status', render: (row) => row.status },
          { label: 'Issue date', render: (row) => new Date(row.issueDate).toLocaleDateString() },
          { label: 'Balance', render: (row) => money(row.balance, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}

export function QuotesPage() {
  const quotes = useQuotes({ pageSize: 50 });
  const createQuote = useCreateQuote();
  return (
    <FinanceShell
      title="Quotes"
      description="Create, version, approve, expire, and prepare quotes for conversion into invoices."
    >
      <Button
        className="w-fit"
        onClick={() =>
          createQuote.mutate({
            items: [{ description: 'Proposal package', quantity: 1, unitPrice: 900 }],
          })
        }
      >
        <Plus className="mr-2 size-4" />
        New quote
      </Button>
      <FinanceTable
        rows={items(quotes.data)}
        empty="No quotes yet."
        columns={[
          { label: 'Number', render: (row: Quote) => row.quoteNumber },
          { label: 'Status', render: (row) => row.status },
          {
            label: 'Expiry',
            render: (row) =>
              row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'No expiry',
          },
          { label: 'Total', render: (row) => money(row.total, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}

export function PaymentsPage() {
  const payments = usePayments({ pageSize: 50 });
  return (
    <FinanceShell
      title="Payments"
      description="Manual, bank transfer, card, cash, Stripe future, PayPal future, and payment history architecture."
    >
      <FinanceTable
        rows={items(payments.data)}
        empty="No payments yet."
        columns={[
          { label: 'Method', render: (row: Payment) => row.method },
          { label: 'Status', render: (row) => row.status },
          { label: 'Date', render: (row) => new Date(row.paymentDate).toLocaleDateString() },
          { label: 'Amount', render: (row) => money(row.amount, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}

export function ExpensesPage() {
  const expenses = useExpenses({ pageSize: 50 });
  const createExpense = useCreateExpense();
  return (
    <FinanceShell
      title="Expenses"
      description="Receipt upload placeholders, categories, approvals, project links, departments, and tags."
    >
      <Button
        className="w-fit"
        onClick={() => createExpense.mutate({ title: 'Office supplies', amount: 120, tax: 24 })}
      >
        <Plus className="mr-2 size-4" />
        New expense
      </Button>
      <FinanceTable
        rows={items(expenses.data)}
        empty="No expenses yet."
        columns={[
          { label: 'Title', render: (row: Expense) => row.title },
          { label: 'Vendor', render: (row) => row.vendor ?? 'Unassigned' },
          { label: 'Status', render: (row) => row.status },
          { label: 'Total', render: (row) => money(row.total, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}

export function PurchaseOrdersPage() {
  const purchaseOrders = usePurchaseOrders({ pageSize: 50 });
  return (
    <FinanceShell
      title="Purchase orders"
      description="Supplier orders, approvals, delivery status, item lines, and linked invoice architecture."
    >
      <FinanceTable
        rows={items(purchaseOrders.data)}
        empty="No purchase orders yet."
        columns={[
          { label: 'Order', render: (row: PurchaseOrder) => row.orderNumber },
          { label: 'Status', render: (row) => row.status },
          { label: 'Supplier', render: (row) => row.supplierId ?? 'Unassigned' },
          { label: 'Total', render: (row) => money(row.total, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}

export function ReportsPage() {
  const reports = useFinancialReports({ pageSize: 50 });
  const summary = useFinanceReportSummary();
  return (
    <FinanceShell
      title="Reports"
      description="Profit and loss, revenue, expenses, cash flow, tax summary, customer revenue, project profitability, and department spend."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {['Profit & Loss', 'Revenue', 'Cash Flow', 'Tax Summary'].map((report) => (
          <StatCard
            key={report}
            icon={BarChart3}
            label={report}
            value="Ready"
            hint="Generated from finance records and prepared for export."
          />
        ))}
      </div>
      <section className="premium-card p-5">
        <h2 className="font-semibold">Summary snapshot</h2>
        <pre className="mt-4 max-h-80 overflow-auto rounded-md bg-secondary p-4 text-xs">
          {JSON.stringify(summary.data ?? { status: 'Loading report summary' }, null, 2)}
        </pre>
      </section>
      <FinanceTable
        rows={items(reports.data)}
        empty="No saved reports yet."
        columns={[
          { label: 'Name', render: (row) => row.name },
          { label: 'Type', render: (row) => row.type },
          {
            label: 'Period',
            render: (row) =>
              `${new Date(row.periodStart).toLocaleDateString()} - ${new Date(row.periodEnd).toLocaleDateString()}`,
          },
          { label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        ]}
      />
    </FinanceShell>
  );
}

export function BudgetsPage() {
  const budgets = useBudgets({ pageSize: 50 });
  return (
    <FinanceShell
      title="Budgets"
      description="Budget utilisation, project budgets, department spend, forecasts, and recommendation architecture."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items(budgets.data).map((budget: Budget) => (
          <section key={budget.id} className="premium-card p-5">
            <h2 className="font-semibold">{budget.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {money(budget.spent)} spent of {money(budget.amount)}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.min((Number(budget.spent) / Math.max(Number(budget.amount), 1)) * 100, 100)}%`,
                }}
              />
            </div>
          </section>
        ))}
        {!items(budgets.data).length && (
          <p className="premium-card p-6 text-sm text-muted-foreground">No budgets yet.</p>
        )}
      </div>
    </FinanceShell>
  );
}

export function CashFlowPage() {
  const cashFlow = useCashFlow({ pageSize: 50 });
  return (
    <FinanceShell
      title="Cash flow"
      description="Expected and actual inflows/outflows connected to customers, projects, invoices, payments, and expenses."
    >
      <FinanceTable
        rows={items(cashFlow.data)}
        empty="No cash-flow entries yet."
        columns={[
          { label: 'Direction', render: (row: CashFlowEntry) => row.direction },
          { label: 'Description', render: (row) => row.description ?? 'Untitled' },
          { label: 'Expected', render: (row) => new Date(row.expectedDate).toLocaleDateString() },
          { label: 'Amount', render: (row) => money(row.amount, row.currency) },
        ]}
      />
    </FinanceShell>
  );
}
