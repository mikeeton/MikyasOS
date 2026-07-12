import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FileText,
  Loader2,
  Receipt,
  Search,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Link, useNavigate } from 'react-router';

import {
  aiOsApi,
  crmApi,
  documentsApi,
  financeApi,
  projectsApi,
  type AiMemoryOverview,
} from '@/api/client';
import { Button } from '@/components/ui/button';
import { useTrackProductEvent } from '@/features/analytics/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

import { useWorkspace } from '../hooks/use-workspace';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  score?: number;
};

const quickSearches = [
  { label: 'Customers', query: 'customer', href: '/app/crm/search', icon: UsersRound },
  { label: 'Projects', query: 'project', href: '/app/projects/list', icon: BriefcaseBusiness },
  { label: 'Documents', query: 'document', href: '/app/documents/search', icon: FileText },
  { label: 'Invoices', query: 'invoice', href: '/app/invoices', icon: Receipt },
  { label: 'AI memory', query: 'memory', href: '/app/ai/memory', icon: Bot },
  { label: 'Overdue work', query: 'overdue', href: '/app/today', icon: Target },
  { label: 'Revenue', query: 'revenue', href: '/app/analytics', icon: CreditCard },
  { label: 'Meetings', query: 'meeting', href: '/app/meetings', icon: BriefcaseBusiness },
];

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mikyasos:recent-searches') ?? '[]') as string[];
    } catch {
      return [];
    }
  });
  const trackEvent = useTrackProductEvent();
  const lastTrackedQueryRef = useRef('');
  const trimmedQuery = query.trim();
  const searchEnabled = Boolean(
    open && token && currentOrganisation?.id && trimmedQuery.length >= 2,
  );

  const searchQuery = useQuery({
    queryKey: ['global-search', currentOrganisation?.id, trimmedQuery],
    queryFn: async () => {
      const organisationId = currentOrganisation!.id;
      const [crm, work, documents, invoices, quotes, expenses, aiMemory] = await Promise.all([
        crmApi.search(token!, organisationId, trimmedQuery),
        projectsApi.search(token!, organisationId, trimmedQuery),
        documentsApi.search(token!, organisationId, { search: trimmedQuery, pageSize: 5 }),
        financeApi.invoices(token!, organisationId, { search: trimmedQuery, pageSize: 3 }),
        financeApi.quotes(token!, organisationId, { search: trimmedQuery, pageSize: 3 }),
        financeApi.expenses(token!, organisationId, { search: trimmedQuery, pageSize: 3 }),
        aiOsApi.memory(token!, organisationId),
      ]);

      return normalizeResults({
        crm,
        work,
        documents: documents.items,
        invoices: invoices.items,
        quotes: quotes.items,
        expenses: expenses.items,
        aiMemory,
        query: trimmedQuery,
      });
    },
    enabled: searchEnabled,
  });

  const groupedResults = useMemo(() => {
    const results = searchQuery.data ?? [];
    return results.reduce<Record<string, SearchResult[]>>((groups, result) => {
      const existing = groups[result.eyebrow] ?? [];
      return { ...groups, [result.eyebrow]: [...existing, result] };
    }, {});
  }, [searchQuery.data]);

  const resultCount = searchQuery.data?.length ?? 0;
  const flatResults = searchQuery.data ?? [];

  useEffect(() => {
    if (
      !searchQuery.isSuccess ||
      trimmedQuery.length < 2 ||
      lastTrackedQueryRef.current === trimmedQuery
    ) {
      return;
    }

    lastTrackedQueryRef.current = trimmedQuery;
    setRecentSearches((items) => {
      const next = [trimmedQuery, ...items.filter((item) => item !== trimmedQuery)].slice(0, 5);
      localStorage.setItem('mikyasos:recent-searches', JSON.stringify(next));
      return next;
    });
    trackEvent.mutate({
      name: 'global_search_performed',
      source: 'global_search_modal',
      metadata: {
        queryLength: trimmedQuery.length,
        resultCount,
        groups: Object.keys(groupedResults),
      },
    });
  }, [groupedResults, resultCount, searchQuery.isSuccess, trackEvent, trimmedQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmedQuery]);

  const openResult = (result: SearchResult, index: number) => {
    trackEvent.mutate({
      name: 'global_search_result_opened',
      source: 'global_search_modal',
      entityType: result.eyebrow.toLowerCase(),
      entityId: result.id,
      metadata: {
        queryLength: trimmedQuery.length,
        rank: index + 1,
        href: result.href,
      },
    });
    onOpenChange(false);
    void navigate(result.href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-start bg-background/75 px-4 pt-20 backdrop-blur-sm sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="premium-glass mx-auto w-full max-w-3xl overflow-hidden rounded-md"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onOpenChange(false);
              }
              if (event.key === 'ArrowDown' && flatResults.length > 0) {
                event.preventDefault();
                setSelectedIndex((index) => Math.min(index + 1, flatResults.length - 1));
              }
              if (event.key === 'ArrowUp' && flatResults.length > 0) {
                event.preventDefault();
                setSelectedIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === 'Enter' && flatResults[selectedIndex]) {
                event.preventDefault();
                openResult(flatResults[selectedIndex], selectedIndex);
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="Search customers, projects, tasks, documents, invoices..."
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {searchQuery.isFetching ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : (
                <kbd className="hidden rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline">
                  Esc
                </kbd>
              )}
            </div>

            <div className="max-h-[32rem] overflow-y-auto p-4">
              {!trimmedQuery && (
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">Search the whole operating system</p>
                      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                        Find CRM records, work, knowledge, finance records, and AI memory from one
                        place. Use natural phrases like "projects due next week" or "customers in
                        London".
                      </p>
                    </div>
                    <span className="status-pill status-pill-success w-fit">Live search</span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {quickSearches.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          className="premium-interactive premium-muted-panel flex items-center gap-3 px-3 py-3 text-left text-sm"
                          onClick={() => setQuery(item.query)}
                        >
                          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{item.label}</span>
                            <span className="block text-xs text-muted-foreground">
                              Search {item.label.toLowerCase()}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {recentSearches.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Recent searches
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recentSearches.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                            onClick={() => setQuery(item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {trimmedQuery.length === 1 && (
                <div className="rounded-md border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
                  Type at least 2 characters to search across the workspace.
                </div>
              )}

              {searchQuery.isError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-4">
                  <p className="text-sm font-medium">Search could not complete.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check your connection or open Platform Health if this keeps happening.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => void searchQuery.refetch()}>
                      Retry
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/app/admin/platform/health" onClick={() => onOpenChange(false)}>
                        Platform health
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {searchEnabled && searchQuery.isSuccess && resultCount === 0 && (
                <div className="rounded-md border border-dashed border-border bg-background/60 px-3 py-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">No results for "{trimmedQuery}"</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Try a customer name, project title, task keyword, document tag, invoice
                        number, quote number, or expense vendor.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setQuery('')}>
                      Clear search
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/app/crm/search" onClick={() => onOpenChange(false)}>
                        Open CRM search
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {resultCount > 0 && (
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {resultCount} result{resultCount === 1 ? '' : 's'} for "{trimmedQuery}"
                    </p>
                    <span className="text-xs text-muted-foreground">
                      CRM, work, docs, finance, AI
                    </span>
                  </div>
                  {Object.entries(groupedResults).map(([group, results]) => (
                    <section key={group}>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {group}
                      </h2>
                      <div className="grid gap-2">
                        {results.map((result) => {
                          const Icon = result.icon;
                          const resultIndex = flatResults.findIndex(
                            (item) => item.id === result.id,
                          );
                          const selected = resultIndex === selectedIndex;
                          return (
                            <button
                              key={result.id}
                              type="button"
                              onClick={() => openResult(result, resultIndex)}
                              className={cn(
                                'premium-interactive premium-muted-panel flex items-start gap-3 px-3 py-3 text-left',
                                selected && 'ring-2 ring-ring',
                              )}
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background/70">
                                <Icon className="size-4 text-muted-foreground" aria-hidden={true} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">
                                  {result.title}
                                </span>
                                <span className="mt-1 block truncate text-xs text-muted-foreground">
                                  {result.description}
                                </span>
                              </span>
                              <ArrowUpRight
                                className="mt-1 size-4 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function normalizeResults(input: {
  crm: Awaited<ReturnType<typeof crmApi.search>>;
  work: Awaited<ReturnType<typeof projectsApi.search>>;
  documents: Awaited<ReturnType<typeof documentsApi.search>>['items'];
  invoices: Awaited<ReturnType<typeof financeApi.invoices>>['items'];
  quotes: Awaited<ReturnType<typeof financeApi.quotes>>['items'];
  expenses: Awaited<ReturnType<typeof financeApi.expenses>>['items'];
  aiMemory: AiMemoryOverview;
  query: string;
}): SearchResult[] {
  const results: SearchResult[] = [];

  input.crm.results.companies.slice(0, 5).forEach((company) => {
    results.push({
      id: `company-${company.id}`,
      title: company.name,
      description: [company.status, company.industry, company.email].filter(Boolean).join(' · '),
      eyebrow: 'CRM',
      href: `/app/crm/companies/${company.id}`,
      icon: Building2,
    });
  });

  input.crm.results.contacts.slice(0, 5).forEach((contact) => {
    results.push({
      id: `contact-${contact.id}`,
      title: `${contact.firstName} ${contact.lastName}`,
      description: [contact.jobTitle, contact.email, contact.company?.name]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'CRM',
      href: `/app/crm/contacts/${contact.id}`,
      icon: UsersRound,
    });
  });

  input.crm.results.leads.slice(0, 3).forEach((lead) => {
    results.push({
      id: `lead-${lead.id}`,
      title: lead.company?.name ?? lead.source ?? 'Lead',
      description: [lead.status, `${lead.probability}% probability`, lead.description]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'CRM',
      href: '/app/crm/leads',
      icon: Target,
    });
  });

  input.work.results.projects.slice(0, 5).forEach((project) => {
    results.push({
      id: `project-${project.id}`,
      title: project.name,
      description: [project.status, project.priority, project.company?.name]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Projects',
      href: `/app/projects/${project.id}`,
      icon: BriefcaseBusiness,
    });
  });

  input.work.results.tasks.slice(0, 5).forEach((task) => {
    results.push({
      id: `task-${task.id}`,
      title: task.title,
      description: [task.status, task.priority, task.project?.name].filter(Boolean).join(' · '),
      eyebrow: 'Projects',
      href: `/app/tasks/${task.id}`,
      icon: Target,
    });
  });

  input.documents.slice(0, 5).forEach((document) => {
    results.push({
      id: `document-${document.id}`,
      title: document.title,
      description: [document.documentType, document.fileName, document.visibility]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Documents',
      href: `/app/documents/${document.id}`,
      icon: FileText,
    });
  });

  input.invoices.slice(0, 3).forEach((invoice) => {
    results.push({
      id: `invoice-${invoice.id}`,
      title: invoice.invoiceNumber,
      description: [invoice.status, invoice.currency, formatMoney(invoice.total)]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Finance',
      href: '/app/invoices',
      icon: Receipt,
    });
  });

  input.quotes.slice(0, 3).forEach((quote) => {
    results.push({
      id: `quote-${quote.id}`,
      title: quote.quoteNumber,
      description: [quote.status, quote.currency, formatMoney(quote.total)]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Finance',
      href: '/app/quotes',
      icon: CreditCard,
    });
  });

  input.expenses.slice(0, 3).forEach((expense) => {
    results.push({
      id: `expense-${expense.id}`,
      title: expense.title,
      description: [expense.status, expense.vendor, formatMoney(expense.total ?? expense.amount)]
        .filter(Boolean)
        .join(' · '),
      eyebrow: 'Finance',
      href: '/app/expenses',
      icon: Receipt,
    });
  });

  const queryMatchesAi =
    ['ai', 'memory', 'prompt', 'recent', 'action'].some((word) =>
      word.includes(input.query.toLowerCase()),
    ) || input.query.toLowerCase().includes('ai');

  if (queryMatchesAi) {
    results.push({
      id: 'ai-memory-overview',
      title: 'AI memory overview',
      description: `${input.aiMemory.businessMemory.companyCount} companies, ${input.aiMemory.businessMemory.projectCount} projects, ${input.aiMemory.businessMemory.documentCount} documents in business memory`,
      eyebrow: 'AI',
      href: '/app/ai/memory',
      icon: Bot,
    });
  }

  input.aiMemory.recentActions.slice(0, 3).forEach((action) => {
    if (!action.action.toLowerCase().includes(input.query.toLowerCase())) {
      return;
    }

    results.push({
      id: `ai-action-${action.id}`,
      title: action.action,
      description: [action.entityType, action.createdAt].filter(Boolean).join(' · '),
      eyebrow: 'AI',
      href: '/app/ai/history',
      icon: Sparkles,
    });
  });

  return results
    .map((result) => ({ ...result, score: scoreResult(result, input.query) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.title.localeCompare(b.title))
    .slice(0, 30);
}

function scoreResult(result: SearchResult, query: string) {
  const q = query.toLowerCase();
  const title = result.title.toLowerCase();
  const description = result.description.toLowerCase();
  let score = 10;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 60;
  if (title.includes(q)) score += 35;
  if (description.includes(q)) score += 15;
  if (['CRM', 'Projects', 'Documents', 'Finance'].includes(result.eyebrow)) score += 5;

  return score;
}

function formatMoney(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(number);
}
