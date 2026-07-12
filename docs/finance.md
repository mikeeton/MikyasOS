# Finance & Billing

Milestone 10 adds the mikyasOS financial operating layer. It is not full accounting software yet; it connects financial records to CRM, projects, documents, meetings, automation, AI, business intelligence, and future knowledge graph architecture.

## Architecture

Backend module:

- `FinanceModule`
- `InvoicesModule`
- `QuotesModule`
- `PaymentsModule`
- `ExpensesModule`
- `PurchaseOrdersModule`
- `BudgetsModule`
- `CashFlowModule`
- `TaxModule`
- `CurrenciesModule`
- `ReportsModule`

Core service:

- `FinanceService` handles CRUD, invoice/quote line totals, dashboard metrics, payment validation, budget validation, reports, and audit logging.

AI preparation services:

- `FinancialInsightService`
- `CashFlowPredictionService`
- `InvoiceRiskService`
- `BudgetRecommendationService`
- `RevenueForecastService`

These services expose architecture only. LLM generation is intentionally disabled.

## Database Models

Finance adds:

- `Invoice`
- `InvoiceItem`
- `Quote`
- `QuoteItem`
- `Expense`
- `ExpenseCategory`
- `Payment`
- `PurchaseOrder`
- `PurchaseOrderItem`
- `RecurringInvoice`
- `Subscription`
- `Budget`
- `Transaction`
- `Account`
- `TaxRate`
- `Currency`
- `FinancialReport`
- `CashFlowEntry`
- `JournalEntry`
- `FinanceAudit`

Records are organisation-scoped, UUID-based, timestamped, soft-deletable, indexed, and linked to customers/projects where appropriate.

## API

All endpoints are under `/api/v1/finance` and require JWT auth plus organisation isolation.

- `GET /capabilities`
- `GET /dashboard`
- `GET /reports/summary`
- `GET /invoices`
- `GET /invoices/:id`
- `POST /invoices`
- `PATCH /invoices/:id`
- `DELETE /invoices/:id`
- `GET /quotes`
- `POST /quotes`
- `GET /payments`
- `POST /payments`
- `GET /expenses`
- `POST /expenses`
- `GET /purchase-orders`
- `POST /purchase-orders`
- `GET /budgets`
- `POST /budgets`
- `GET /cashflow`
- `POST /cashflow`
- `GET /reports`
- `GET /accounts`
- `POST /accounts`
- `GET /tax-rates`
- `POST /tax-rates`
- `GET /currencies`
- `POST /currencies`
- `GET /subscriptions`
- `POST /subscriptions`
- `GET /recurring-invoices`
- `POST /recurring-invoices`
- `GET /transactions`
- `POST /transactions`
- `GET /expense-categories`
- `POST /expense-categories`

## Reporting

Prepared report views:

- Profit & Loss
- Revenue
- Expenses
- Cash Flow
- Tax Summary
- Customer Revenue
- Project Profitability
- Department Spend

The dashboard calculates:

- revenue
- payments received
- expenses
- profit
- outstanding invoices
- overdue invoices
- upcoming payments
- net cash flow
- budget utilisation
- recent transactions

## Frontend Routes

- `/app/finance`
- `/app/invoices`
- `/app/quotes`
- `/app/payments`
- `/app/expenses`
- `/app/purchase-orders`
- `/app/reports`
- `/app/budgets`
- `/app/cashflow`

The UI includes executive metrics, invoice builder entry points, tables, report summary, budget utilisation cards, cash-flow views, and premium AI insight placeholders.

## Security

Finance uses:

- JWT auth
- organisation isolation
- permission guards
- finance permissions
- audit logging
- soft deletes
- validation for money, invoice items, payment amounts, and budget periods

## Developer Guide

Useful commands:

```bash
npm run prisma:generate -w @mikyasos/api
npm run typecheck
npm run lint
npm test
npm run build
docker compose up -d
```

Manual smoke flow:

1. Register or log in.
2. Create or switch to an organisation.
3. Open `/app/finance`.
4. Create a demo invoice.
5. Visit `/app/invoices`, `/app/reports`, `/app/budgets`, and `/app/cashflow`.
6. Verify `/api/v1/finance/dashboard` and `/api/v1/finance/capabilities`.

## Future Work

Milestone 11 can expand into:

- Stripe and PayPal integration
- PDF invoice rendering
- invoice email delivery
- recurring invoice runner
- quote conversion flow
- receipt upload and OCR
- approval UI for expenses and purchase orders
- richer report generation and exports
- accounting integration sync
- AI financial insight generation with citations
