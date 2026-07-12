import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  ListChecks,
  Plus,
  Search,
  Video,
} from 'lucide-react';

import {
  communicationApi,
  financeApi,
  projectsApi,
  type CashFlowEntry,
  type Expense,
  type Invoice,
  type Meeting,
  type Project,
  type Quote,
  type Task,
} from '@/api/client';
import { Button } from '@/components/ui/button';
import { useTrackProductEvent } from '@/features/analytics/hooks/use-analytics';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

type CalendarEventType =
  'meeting' | 'task' | 'project' | 'invoice' | 'quote' | 'expense' | 'cashflow';

type CalendarEvent = {
  id: string;
  entityId: string;
  type: CalendarEventType;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  status?: string;
  meta: string;
  href?: string;
  amount?: string | number | null;
  source: unknown;
};

const eventStyles: Record<
  CalendarEventType,
  { label: string; icon: typeof CalendarDays; className: string }
> = {
  meeting: {
    label: 'Meeting',
    icon: Video,
    className:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200',
  },
  task: {
    label: 'Task',
    icon: ListChecks,
    className:
      'border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-200',
  },
  project: {
    label: 'Project',
    icon: BriefcaseBusiness,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200',
  },
  invoice: {
    label: 'Invoice',
    icon: CircleDollarSign,
    className:
      'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200',
  },
  quote: {
    label: 'Quote',
    icon: FileText,
    className:
      'border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-200',
  },
  expense: {
    label: 'Expense',
    icon: CircleDollarSign,
    className:
      'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
  },
  cashflow: {
    label: 'Cash flow',
    icon: CircleDollarSign,
    className:
      'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200',
  },
};

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dateKey(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatMoney(value?: string | number | null, currency = 'USD') {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number === 0) return null;
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(number);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildMonthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function items<T>(data?: { items: T[] }): T[] {
  return data?.items ?? [];
}

function toCalendarEvents({
  meetings,
  tasks,
  projects,
  invoices,
  quotes,
  expenses,
  cashFlow,
}: {
  meetings: Meeting[];
  tasks: Task[];
  projects: Project[];
  invoices: Invoice[];
  quotes: Quote[];
  expenses: Expense[];
  cashFlow: CashFlowEntry[];
}): CalendarEvent[] {
  return [
    ...meetings.map((meeting) => ({
      id: `meeting-${meeting.id}`,
      entityId: meeting.id,
      type: 'meeting' as const,
      title: meeting.title,
      startsAt: meeting.startsAt,
      endsAt: meeting.endsAt,
      status: meeting.status,
      meta:
        meeting.location || meeting.videoUrl || `${meeting.participants?.length ?? 0} participants`,
      href: `/app/meetings/${meeting.id}`,
      source: meeting,
    })),
    ...tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: `task-${task.id}`,
        entityId: task.id,
        type: 'task' as const,
        title: task.title,
        startsAt: task.dueDate!,
        status: task.status,
        meta: task.project?.name ?? 'Task deadline',
        href: `/app/tasks/${task.id}`,
        source: task,
      })),
    ...projects
      .filter((project) => project.dueDate || project.startDate)
      .map((project) => ({
        id: `project-${project.id}`,
        entityId: project.id,
        type: 'project' as const,
        title: project.name,
        startsAt: project.dueDate ?? project.startDate!,
        status: project.status,
        meta: project.dueDate ? 'Project due date' : 'Project start date',
        href: `/app/projects/${project.id}`,
        source: project,
      })),
    ...invoices
      .filter((invoice) => invoice.dueDate)
      .map((invoice) => ({
        id: `invoice-${invoice.id}`,
        entityId: invoice.id,
        type: 'invoice' as const,
        title: invoice.invoiceNumber,
        startsAt: invoice.dueDate!,
        status: invoice.status,
        meta: 'Invoice due',
        href: '/app/invoices',
        amount: invoice.balance ?? invoice.total,
        source: invoice,
      })),
    ...quotes
      .filter((quote) => quote.expiryDate)
      .map((quote) => ({
        id: `quote-${quote.id}`,
        entityId: quote.id,
        type: 'quote' as const,
        title: quote.quoteNumber,
        startsAt: quote.expiryDate!,
        status: quote.status,
        meta: 'Quote expires',
        href: '/app/quotes',
        amount: quote.total,
        source: quote,
      })),
    ...expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      entityId: expense.id,
      type: 'expense' as const,
      title: expense.title,
      startsAt: expense.expenseDate,
      status: expense.status,
      meta: expense.vendor ?? 'Expense recorded',
      href: '/app/expenses',
      amount: expense.amount,
      source: expense,
    })),
    ...cashFlow.map((entry) => ({
      id: `cashflow-${entry.id}`,
      entityId: entry.id,
      type: 'cashflow' as const,
      title:
        entry.description || `${entry.direction === 'INFLOW' ? 'Incoming' : 'Outgoing'} cash flow`,
      startsAt: entry.expectedDate,
      status: entry.status,
      meta: entry.direction,
      href: '/app/cashflow',
      amount: entry.amount,
      source: entry,
    })),
  ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

function EventPill({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const style = eventStyles[event.type];
  const Icon = style.icon;
  const content = (
    <span
      draggable={event.type === 'meeting' || event.type === 'task'}
      onDragStart={(dragEvent) => {
        dragEvent.dataTransfer.setData('text/calendar-event-id', event.id);
        dragEvent.dataTransfer.effectAllowed = 'move';
      }}
      className={cn(
        'flex cursor-grab items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition hover:shadow-md active:cursor-grabbing',
        style.className,
        compact && 'truncate px-1.5 py-0.5 text-[11px]',
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{event.title}</span>
    </span>
  );

  if (event.href) {
    return (
      <Link to={event.href} title={`${style.label}: ${event.title}`}>
        {content}
      </Link>
    );
  }

  return content;
}

function EventRow({ event }: { event: CalendarEvent }) {
  const style = eventStyles[event.type];
  const money = formatMoney(event.amount);
  return (
    <article className="premium-list-link flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <EventPill event={event} />
          {event.status && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {event.status}
            </span>
          )}
        </div>
        <p className="mt-2 truncate text-sm text-muted-foreground">{event.meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
        <span>{formatDate(event.startsAt)}</span>
        {event.type === 'meeting' && <span>{formatTime(event.startsAt)}</span>}
        {money && <span className="font-medium text-foreground">{money}</span>}
        <span className={cn('rounded-full px-2 py-1 text-xs', style.className)}>{style.label}</span>
      </div>
    </article>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-md border bg-secondary/50" />
      ))}
    </div>
  );
}

export function CalendarPage() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  const organisationId = currentOrganisation?.id ?? null;
  const enabled = Boolean(token && organisationId);
  const queryClient = useQueryClient();
  const trackEvent = useTrackProductEvent();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [view, setView] = useState<'day' | 'week' | 'month' | 'agenda'>('month');
  const [createType, setCreateType] = useState<'meeting' | 'task' | 'invoice-reminder'>('meeting');
  const [meetingTitle, setMeetingTitle] = useState('');

  const meetings = useQuery({
    queryKey: ['calendar', 'meetings', organisationId],
    queryFn: () => communicationApi.meetings(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const tasks = useQuery({
    queryKey: ['calendar', 'tasks', organisationId],
    queryFn: () => projectsApi.tasks(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const projects = useQuery({
    queryKey: ['calendar', 'projects', organisationId],
    queryFn: () => projectsApi.projects(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const invoices = useQuery({
    queryKey: ['calendar', 'invoices', organisationId],
    queryFn: () => financeApi.invoices(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const quotes = useQuery({
    queryKey: ['calendar', 'quotes', organisationId],
    queryFn: () => financeApi.quotes(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const expenses = useQuery({
    queryKey: ['calendar', 'expenses', organisationId],
    queryFn: () => financeApi.expenses(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const cashFlow = useQuery({
    queryKey: ['calendar', 'cashflow', organisationId],
    queryFn: () => financeApi.cashFlow(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });

  const updateMeeting = useMutation({
    mutationFn: (body: { id: string; startsAt: string; endsAt: string }) =>
      communicationApi.updateMeeting(token!, organisationId!, body.id, {
        startsAt: body.startsAt,
        endsAt: body.endsAt,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['today'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: (body: { id: string; dueDate: string }) =>
      projectsApi.updateTask(token!, organisationId!, body.id, { dueDate: body.dueDate }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['today'] });
    },
  });

  const createRecord = useMutation<unknown, Error, void>({
    mutationFn: () => {
      const date = new Date(selectedDate);
      date.setHours(10, 0, 0, 0);
      const end = new Date(date);
      end.setHours(10, 30, 0, 0);
      const title = meetingTitle.trim();

      if (createType === 'task') {
        const firstProject = items(projects.data)[0];
        if (!firstProject) {
          throw new Error('Create a project before adding tasks from calendar.');
        }
        return projectsApi.createTask(token!, organisationId!, {
          projectId: firstProject.id,
          title,
          dueDate: date.toISOString(),
          status: 'TODO',
          priority: 'MEDIUM',
        });
      }

      return communicationApi.createMeeting(token!, organisationId!, {
        title: createType === 'invoice-reminder' ? `Invoice reminder: ${title}` : title,
        startsAt: date.toISOString(),
        endsAt: end.toISOString(),
        status: 'SCHEDULED',
      });
    },
    onSuccess: () => {
      setMeetingTitle('');
      void queryClient.invalidateQueries({ queryKey: ['calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['today'] });
      trackEvent.mutate({
        name: 'calendar_record_created',
        source: 'calendar',
        entityType: createType,
      });
    },
  });

  const calendarEvents = useMemo(
    () =>
      toCalendarEvents({
        meetings: items(meetings.data),
        tasks: items(tasks.data),
        projects: items(projects.data),
        invoices: items(invoices.data),
        quotes: items(quotes.data),
        expenses: items(expenses.data),
        cashFlow: items(cashFlow.data),
      }),
    [
      cashFlow.data,
      expenses.data,
      invoices.data,
      meetings.data,
      projects.data,
      quotes.data,
      tasks.data,
    ],
  );

  const isLoading =
    meetings.isLoading ||
    tasks.isLoading ||
    projects.isLoading ||
    invoices.isLoading ||
    quotes.isLoading ||
    expenses.isLoading ||
    cashFlow.isLoading;
  const hasError =
    meetings.isError ||
    tasks.isError ||
    projects.isError ||
    invoices.isError ||
    quotes.isError ||
    expenses.isError ||
    cashFlow.isError;

  const selectedEvents = calendarEvents.filter((event) => dateKey(event.startsAt) === selectedDate);
  const today = startOfDay(new Date());
  const upcomingEvents = calendarEvents
    .filter((event) => startOfDay(new Date(event.startsAt)) >= today)
    .slice(0, 8);
  const overdueEvents = calendarEvents
    .filter((event) => {
      const isPast = startOfDay(new Date(event.startsAt)) < today;
      const complete = ['DONE', 'COMPLETED', 'PAID', 'CLOSED'].includes(
        String(event.status).toUpperCase(),
      );
      return isPast && !complete;
    })
    .slice(0, 6);
  const monthDays = buildMonthDays(month);
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
    month,
  );
  const monthEventCount = calendarEvents.filter(
    (event) => new Date(event.startsAt).getMonth() === month.getMonth(),
  ).length;
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return dateKey(date);
  });
  const focusedEvents =
    view === 'day'
      ? selectedEvents
      : view === 'week'
        ? calendarEvents.filter((event) => weekDates.includes(dateKey(event.startsAt)))
        : calendarEvents;

  const rescheduleEvent = (eventId: string, targetDate: string) => {
    const calendarEvent = calendarEvents.find((event) => event.id === eventId);
    if (!calendarEvent || !['meeting', 'task'].includes(calendarEvent.type)) {
      return;
    }

    const nextStart = new Date(targetDate);
    const originalStart = new Date(calendarEvent.startsAt);
    nextStart.setHours(originalStart.getHours() || 10, originalStart.getMinutes(), 0, 0);

    if (calendarEvent.type === 'task') {
      updateTask.mutate({ id: calendarEvent.entityId, dueDate: nextStart.toISOString() });
      return;
    }

    const originalEnd = calendarEvent.endsAt ? new Date(calendarEvent.endsAt) : null;
    const duration = originalEnd
      ? Math.max(originalEnd.getTime() - originalStart.getTime(), 30 * 60 * 1000)
      : 30 * 60 * 1000;
    const nextEnd = new Date(nextStart.getTime() + duration);
    updateMeeting.mutate({
      id: calendarEvent.entityId,
      startsAt: nextStart.toISOString(),
      endsAt: nextEnd.toISOString(),
    });
  };

  return (
    <div className="grid gap-6">
      <header className="premium-section premium-hero flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Workspace / Calendar</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Calendar command centre</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            A live schedule built from meetings, project deadlines, tasks, invoices, quotes,
            expenses, and cash-flow dates across this organisation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'agenda' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('agenda')}
          >
            Agenda
          </Button>
          <Link to="/app/meetings">
            <Button variant="outline" size="sm">
              Meetings
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="premium-metric">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">This month</p>
          <p className="mt-2 text-2xl font-semibold">{monthEventCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">dated records</p>
        </div>
        <div className="premium-metric">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
          <p className="mt-2 text-2xl font-semibold">{upcomingEvents.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">next actions</p>
        </div>
        <div className="premium-metric">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Overdue</p>
          <p className="mt-2 text-2xl font-semibold">{overdueEvents.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">needs attention</p>
        </div>
        <div className="premium-metric">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected day</p>
          <p className="mt-2 text-2xl font-semibold">{selectedEvents.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
        </div>
      </section>

      {hasError && (
        <section className="premium-card border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4" />
            Some calendar data could not load
          </div>
          <p className="mt-2 text-sm">
            The calendar is still safe to use. Retry the page or open the source module if one
            section stays unavailable.
          </p>
        </section>
      )}

      {isLoading ? (
        <LoadingGrid />
      ) : view === 'month' ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="premium-card overflow-hidden">
            <div className="flex items-center justify-between border-b bg-background/60 px-4 py-3 backdrop-blur">
              <div>
                <p className="text-sm text-muted-foreground">Live month view</p>
                <h2 className="text-lg font-semibold">{monthLabel}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, -1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setMonth(now);
                    setSelectedDate(dateKey(now));
                  }}
                >
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b bg-secondary/55 text-xs font-medium text-muted-foreground">
              {weekdayLabels.map((label) => (
                <div key={label} className="px-3 py-2">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const key = dateKey(day);
                const dayEvents = calendarEvents.filter((event) => dateKey(event.startsAt) === key);
                const isCurrentMonth = day.getMonth() === month.getMonth();
                const isSelected = key === selectedDate;
                const isToday = key === dateKey(new Date());
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      rescheduleEvent(event.dataTransfer.getData('text/calendar-event-id'), key);
                    }}
                    className={cn(
                      'calendar-cell min-h-32 border-b border-r p-2 focus:outline-none focus:ring-2 focus:ring-ring',
                      !isCurrentMonth && 'bg-secondary/30 text-muted-foreground',
                      isSelected && 'bg-primary/5 ring-2 ring-inset ring-primary',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={cn(
                          'grid size-7 place-items-center rounded-full text-sm font-medium',
                          isToday && 'bg-foreground text-background',
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {dayEvents.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <EventPill key={event.id} event={event} compact />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <section className="premium-card p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                <h2 className="font-semibold">{formatDate(selectedDate)}</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event) => <EventRow key={event.id} event={event} />)
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Nothing dated here yet. Create a meeting or add due dates to tasks, projects,
                    and finance records.
                  </div>
                )}
              </div>
            </section>

            <section className="premium-card premium-hero p-4">
              <div className="flex items-center gap-2">
                <Plus className="size-4" />
                <h2 className="font-semibold">Create from selected date</h2>
              </div>
              <div className="mt-4 grid gap-3">
                <select
                  value={createType}
                  onChange={(event) =>
                    setCreateType(event.target.value as 'meeting' | 'task' | 'invoice-reminder')
                  }
                  className="premium-input"
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task on first project</option>
                  <option value="invoice-reminder">Invoice follow-up reminder</option>
                </select>
                <input
                  value={meetingTitle}
                  onChange={(event) => setMeetingTitle(event.target.value)}
                  placeholder={
                    createType === 'meeting'
                      ? 'Meeting title'
                      : createType === 'task'
                        ? 'Task title'
                        : 'Invoice/customer to follow up'
                  }
                  className="premium-input"
                />
                <Button
                  disabled={!meetingTitle.trim() || createRecord.isPending}
                  onClick={() => createRecord.mutate()}
                >
                  {createRecord.isPending
                    ? 'Creating...'
                    : `Create ${createType.replace('-', ' ')} on ${formatDate(selectedDate)}`}
                </Button>
                {createType === 'task' && items(projects.data).length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create a project first before adding calendar tasks.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-3">
            {focusedEvents.length > 0 ? (
              focusedEvents.map((event) => <EventRow key={event.id} event={event} />)
            ) : (
              <section className="premium-card p-8 text-center">
                <Search className="mx-auto size-8 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold">No dated work in this view</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Add meeting times, task due dates, project due dates, invoice due dates, and
                  cash-flow dates. They will appear here automatically.
                </p>
              </section>
            )}
          </div>
          <aside className="grid content-start gap-4">
            <section className="premium-card p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <h2 className="font-semibold">Needs attention</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {overdueEvents.length > 0 ? (
                  overdueEvents.map((event) => <EventRow key={event.id} event={event} />)
                ) : (
                  <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    No overdue dated records. Calm waters.
                  </p>
                )}
              </div>
            </section>
            <section className="premium-card p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4" />
                <h2 className="font-semibold">Upcoming next</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {upcomingEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </section>
          </aside>
        </section>
      )}

      <section className="premium-card p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-secondary">
            <CheckCircle2 className="size-4" />
          </span>
          <div>
            <h2 className="font-semibold">Calendar is connected to live workspace data</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Meetings come from Communication. Deadlines come from Projects and Tasks. Billing
              dates come from Finance. This keeps the calendar useful without making you copy events
              into a separate system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
