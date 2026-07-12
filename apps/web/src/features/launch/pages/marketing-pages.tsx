import { Link } from 'react-router';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  FileText,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const modules = [
  ['CRM', 'Manage companies, contacts, pipeline and customer history.', BriefcaseBusiness],
  ['Projects', 'Plan work, track tasks, manage delivery and spot blockers.', Layers3],
  ['Documents', 'Turn files, folders and notes into a searchable knowledge hub.', FileText],
  ['AI', 'Grounded business intelligence across customers, work and knowledge.', Bot],
  ['Automation', 'Event-driven workflows for repetitive operational work.', Workflow],
  ['Finance', 'Invoices, quotes, payments, expenses and executive reporting.', BarChart3],
  ['Analytics', 'Dashboards, KPIs, forecasts and decision-ready snapshots.', BarChart3],
  ['Communication', 'Chats, meetings, announcements and operational memory.', MessageSquare],
  ['Integrations', 'A connector framework for calendars, files, finance and tools.', Network],
  ['Enterprise Security', 'SSO, audit trails, policies, compliance and governance.', ShieldCheck],
] as const;

const pages: Record<string, { eyebrow: string; title: string; body: string }> = {
  features: {
    eyebrow: 'Platform',
    title: 'Every operating module, connected by one business graph.',
    body: 'mikyasOS brings CRM, work, documents, communication, automation, finance, analytics and enterprise controls into one calm workspace.',
  },
  ai: {
    eyebrow: 'AI Operating System',
    title: 'AI that understands the business, not just the prompt.',
    body: 'The AI layer is prepared to reason across customers, projects, documents, meetings, finance, analytics and integrations with permission-aware context.',
  },
  crm: {
    eyebrow: 'CRM',
    title: 'Customer context without the spreadsheet sprawl.',
    body: 'Companies, contacts, opportunities, notes, tags and activity become part of the operational memory of the business.',
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Plan, execute and understand delivery work.',
    body: 'Projects connect tasks, files, timelines, workload, communication and future AI recommendations.',
  },
  documents: {
    eyebrow: 'Documents',
    title: 'A knowledge hub built for human teams and future AI.',
    body: 'Store documents, organise folders, track versions, permissions, activity and linked business records.',
  },
  automation: {
    eyebrow: 'Automation',
    title: 'Workflow automation for the whole company.',
    body: 'Triggers, conditions, actions, queues, approvals and templates prepare mikyasOS for safe operational automation.',
  },
  enterprise: {
    eyebrow: 'Enterprise',
    title: 'Controls for serious organisations.',
    body: 'Business units, custom roles, policies, audit, compliance, SSO and directory sync architecture are built in.',
  },
  about: {
    eyebrow: 'About',
    title: 'An operating system for modern businesses.',
    body: 'mikyasOS is designed around one idea: business software should feel connected, intelligent and trustworthy.',
  },
  careers: {
    eyebrow: 'Careers',
    title: 'Build calm software for ambitious teams.',
    body: 'The careers system is prepared for public roles, hiring pages and team storytelling after launch.',
  },
  security: {
    eyebrow: 'Security',
    title: 'Security and governance from the first customer.',
    body: 'JWT auth, RBAC, tenant isolation, audit trails, protected admin routes, health checks and enterprise policy architecture are in place.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Talk to the mikyasOS team.',
    body: 'Book a demo, ask about enterprise readiness, or discuss your first workspace rollout.',
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Launch notes, product thinking and operating-system ideas.',
    body: 'The blog architecture is prepared for release notes, guides, customer stories and product education.',
  },
};

const legalCopy: Record<string, string> = {
  privacy:
    'Privacy Policy architecture is prepared for data collection, retention, subprocessors, user rights and regional privacy requirements.',
  terms:
    'Terms of Service architecture is prepared for subscriptions, acceptable use, service availability, liability and customer obligations.',
  cookies:
    'Cookie Policy architecture is prepared for consent, analytics, session cookies and preference controls.',
  acceptable:
    'Acceptable Use Policy architecture is prepared for prohibited use, abuse handling and enforcement workflows.',
  dpa: 'Data Processing Agreement architecture is prepared for controller/processor terms, subprocessors, security controls and deletion requests.',
};

function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">mikyasOS</p>
              <p className="text-xs text-muted-foreground">AI Business Operating System</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
            {['Features', 'AI', 'CRM', 'Projects', 'Documents', 'Automation', 'Pricing'].map(
              (item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="hover:text-foreground">
                  {item}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}

function ProductMockup() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-2xl">
      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        <aside className="rounded-md bg-muted/60 p-3">
          {['Dashboard', 'CRM', 'Projects', 'Documents', 'AI', 'Finance'].map((item, index) => (
            <div
              key={item}
              className={`mb-2 rounded-md px-3 py-2 text-xs ${index === 0 ? 'bg-background font-medium shadow-sm' : 'text-muted-foreground'}`}
            >
              {item}
            </div>
          ))}
        </aside>
        <section className="rounded-md bg-background p-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
              <h2 className="mt-1 text-xl font-semibold">Executive command centre</h2>
            </div>
            <BadgeCheck className="size-5 text-primary" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Revenue', 'Open projects', 'AI readiness'].map((label, index) => (
              <div key={label} className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{['$84k', '18', '92%'][index]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-border p-4">
            <p className="text-sm font-medium">AI briefing</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Customer onboarding is healthy. Two projects need attention, and three documents are
              ready for knowledge indexing.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            mikyasOS
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            The AI Business Operating System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            One intelligent platform to run your entire business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Book a Demo</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/features">Watch Overview</Link>
            </Button>
          </div>
        </div>
        <ProductMockup />
      </section>
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {['Launch-ready SaaS', 'AI-native architecture', 'Enterprise governance'].map((item) => (
            <div key={item} className="rounded-md border border-border bg-background p-5">
              <p className="font-medium">{item}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Built for production customers with subscription, support and operational readiness.
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">Everything Connected</p>
          <h2 className="mt-3 text-3xl font-semibold">One system of work and knowledge.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(([title, body, Icon]) => (
            <Link
              key={title}
              to={`/${title.toLowerCase().replace('enterprise security', 'enterprise')}`}
              className="rounded-md border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Icon className="size-5" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

export function MarketingPage({ page }: { page: keyof typeof pages }) {
  const content = pages[page] ?? pages.features!;
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {content.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">{content.body}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.slice(0, 6).map(([title, body, Icon]) => (
            <div key={title} className="rounded-md border border-border bg-card p-5">
              <Icon className="size-5" />
              <p className="mt-4 font-medium">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

export function PricingPage() {
  const plans = [
    ['Starter', '$29', '5 users', '25 GB storage', 'Email support'],
    ['Professional', '$79', '20 users', '100 GB storage', 'Priority support'],
    ['Business', '$199', '100 users', '500 GB storage', 'Launch guidance'],
    ['Enterprise', 'Custom', 'Custom users', 'Custom storage', 'Dedicated success'],
  ];
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Pricing
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Plans that scale with you.</h1>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {plans.map(([name, price, users, storage, support]) => (
            <div key={name} className="rounded-md border border-border bg-card p-5">
              <p className="text-lg font-semibold">{name}</p>
              <p className="mt-4 text-3xl font-semibold">{price}</p>
              <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
                {[users, storage, support, 'AI usage included', 'Billing portal prepared'].map(
                  (item) => (
                    <p key={item} className="flex items-center gap-2">
                      <BadgeCheck className="size-4 text-primary" />
                      {item}
                    </p>
                  ),
                )}
              </div>
              <Button className="mt-6 w-full" asChild>
                <Link to={name === 'Enterprise' ? '/contact' : '/register'}>
                  {name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-md border border-border bg-muted/30 p-5">
          <p className="font-medium">FAQ</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Billing architecture supports monthly, annual, trial, coupons, taxes, proration,
            invoices and future provider integrations.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

export function LegalPage({ type }: { type: keyof typeof legalCopy }) {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <LockKeyhole className="size-8" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">
          {type.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">{legalCopy[type]}</p>
        <div className="mt-8 rounded-md border border-border bg-card p-5">
          <p className="font-medium">Legal review required before production publication.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The app has the route, structure and document taxonomy ready. Final legal text should be
            reviewed by counsel before customer launch.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

export function HelpCentrePage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <BookOpen className="size-8" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Help Centre</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Architecture for documentation, FAQs, video tutorials, release notes, status updates and a
          support portal.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            'Documentation',
            'FAQs',
            'Release notes',
            'Video tutorials',
            'Status page',
            'Support',
          ].map((item) => (
            <div key={item} className="rounded-md border border-border bg-card p-5">
              <p className="font-medium">{item}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prepared for Version 1.0 customer enablement.
              </p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

export function ContactPage() {
  return <MarketingPage page="contact" />;
}

export function BlogPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
        <div className="mt-8 grid gap-4">
          {[
            'Version 1.0 release readiness',
            'What is an AI Business Operating System?',
            'Building operational memory',
          ].map((title) => (
            <article key={title} className="rounded-md border border-border bg-card p-5">
              <p className="font-medium">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Draft editorial architecture prepared for launch content.
              </p>
              <Link to="/features" className="mt-4 inline-flex items-center gap-2 text-sm">
                Read overview <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
