# mikyasOS Production Launch

## Version

Target release: `v1.0.0`.

Milestone 15 prepares mikyasOS for first production customers without redesigning previous product modules.

## SaaS Architecture

The production launch layer includes:

- BillingModule
- SubscriptionModule
- PlanModule
- UsageModule
- CustomerPortalModule
- CheckoutModule

The system separates customer SaaS subscriptions from the Finance module's business subscriptions by using `SaasSubscription` for mikyasOS customer billing.

## Subscription Plans

Supported plan tiers:

- Starter
- Professional
- Business
- Enterprise

Each tier defines user limits, storage, monthly AI token allowance, automation allowance, project/document limits, API access, support level and enterprise feature access.

## Payments

Payment provider architecture supports:

- Stripe
- Paddle
- Lemon Squeezy
- Manual billing

Supported billing concepts:

- Monthly billing
- Annual billing
- Free trials
- Coupons
- Proration
- Tax metadata
- Invoice records
- Refund architecture

Provider-specific production integration remains a post-1.0 implementation task.

## Usage Tracking

Tracked metrics:

- Storage
- AI tokens
- Projects
- CRM records
- Documents
- Users
- Automation executions
- Integrations
- API requests
- Webhooks

Usage records are organisation-scoped and suitable for plan enforcement, reporting and future billing provider metering.

## Customer Portal

Portal functions:

- Manage subscription
- Upgrade
- Downgrade
- Cancel
- Payment method management
- Invoices
- Usage
- Billing history

## Customer Onboarding

First-run onboarding supports:

- Create organisation
- Upload logo
- Invite team
- Choose timezone
- Choose industry
- Import existing data
- Finish onboarding
- Interactive walkthrough
- Sample workspace
- AI introduction
- Progress tracking

## Data Import

Import architecture:

- CSV
- Excel
- CRM data
- Contacts
- Projects
- Tasks
- Documents

## Data Export

Export architecture:

- CSV
- Excel
- PDF
- JSON
- Organisation backup

## Public Website

Public routes:

- `/`
- `/features`
- `/ai`
- `/crm`
- `/projects`
- `/documents`
- `/automation`
- `/pricing`
- `/enterprise`
- `/about`
- `/careers`
- `/security`
- `/privacy`
- `/terms`
- `/contact`
- `/blog`
- `/help`

## Help Centre

Help centre architecture:

- Documentation
- FAQs
- Video tutorials
- Release notes
- Status page
- Support portal

## Email Templates

Email templates:

- Welcome
- Invitation
- Password reset
- Verification
- Invoice
- Trial ending
- Subscription upgraded
- Subscription cancelled

## Legal

Legal document taxonomy:

- Privacy Policy
- Terms of Service
- Cookie Policy
- Acceptable Use Policy
- Data Processing Agreement

Final legal text requires counsel review before production publication.

## Security Summary

Production launch builds on:

- JWT authentication
- Organisation isolation
- RBAC
- Protected billing routes
- Request IDs
- Structured logging architecture
- Health/readiness checks
- Enterprise audit and compliance architecture
- Security headers through Helmet
- Environment-based CORS

MFA and provider-specific SSO remain architecture-ready from Enterprise milestones.

## SEO

Prepared:

- Metadata
- Open Graph tags
- Structured data
- `robots.txt`
- `sitemap.xml`

## Accessibility

Target: WCAG 2.2 AA.

Current implementation uses semantic sections, readable contrast through the design system, focusable buttons/links and non-blocking route fallbacks. Full manual accessibility audit remains required before public production launch.

## Performance

Targets:

- Lighthouse Performance > 95
- Accessibility > 95
- SEO > 95
- Best Practices > 95

Do not claim these scores until Lighthouse is run against the deployed production build.

## Deployment Checklist

- Authentication verified
- CRM verified
- Projects verified
- Documents verified
- AI verified
- Communication verified
- Automation verified
- Finance verified
- Analytics verified
- Integrations verified
- Enterprise verified
- Subscriptions verified
- Customer onboarding verified
- Billing verified
- Marketing website verified
- Performance tested
- Accessibility tested
- Security tested
- Production deployment verified

## Known Limitations

- Stripe, Paddle and Lemon Squeezy are architecture-ready but not connected.
- Public legal content is structured but not counsel-approved.
- Lighthouse, cross-browser and load testing must be run in a deployed environment.
- `v1.0.0` should be tagged after review and commit of this milestone.
