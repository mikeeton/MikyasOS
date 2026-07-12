# mikyasOS Customer Guides

## User Guide

1. Create an account.
2. Create or join an organisation.
3. Complete customer onboarding.
4. Use the workspace sidebar to access CRM, Projects, Documents, AI, Communication, Automation, Finance, Analytics, Integrations and Billing.
5. Use Billing to review plan, usage, invoices and customer portal status.

## Administrator Guide

1. Invite team members.
2. Assign roles and permissions.
3. Review Admin security, audit and compliance pages.
4. Review Platform health and reliability pages.
5. Manage subscription and usage from Billing.
6. Prepare data imports and exports from Billing data portability.

## Developer Guide

1. Install dependencies with `npm install`.
2. Generate Prisma client with `npm run prisma:generate -w @mikyasos/api`.
3. Run verification with `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm test`.
4. Run locally with `docker compose up -d`.

## API Guide

Core API groups:

- `/api/v1/auth`
- `/api/v1/organisations`
- `/api/v1/crm`
- `/api/v1/projects`
- `/api/v1/documents`
- `/api/v1/ai-os`
- `/api/v1/communication`
- `/api/v1/automation`
- `/api/v1/finance`
- `/api/v1/analytics`
- `/api/v1/integrations`
- `/api/v1/enterprise`
- `/api/v1/platform`
- `/api/v1/billing`

## Contribution Guide

Keep changes scoped, preserve module boundaries, run the verification suite and avoid modifying completed milestones unless required for compatibility.
