import { Link } from 'react-router';
import {
  AlertTriangle,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTrackProductEvent } from '@/features/analytics/hooks/use-analytics';
import { cn } from '@/lib/utils';

import { useTodayCommandCentre, type TodayAction } from './use-today-command-centre';

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
    new Date(value),
  );
}

function formatMoney(value: string | number | null | undefined, currency = 'USD') {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof CalendarDays;
}) {
  return (
    <section className="premium-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
    </section>
  );
}

function ActionCard({ action }: { action: TodayAction }) {
  const priorityClass =
    action.priority === 'high'
      ? 'border-destructive/30 bg-destructive/5'
      : action.priority === 'medium'
        ? 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20'
        : 'bg-background/70';

  return (
    <Link
      to={action.route}
      className={cn('premium-interactive rounded-md border p-4 hover:bg-accent', priorityClass)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{action.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{action.detail}</p>
        </div>
        <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
          {action.source}
        </span>
      </div>
    </Link>
  );
}

export function TodayCommandCentrePage() {
  const today = useTodayCommandCentre();
  const trackEvent = useTrackProductEvent();

  const askAi = (question: string) => {
    trackEvent.mutate({
      name: 'today_ai_question_selected',
      source: 'today_command_centre',
      metadata: { question },
    });
  };

  return (
    <section className="grid gap-6">
      <header className="premium-section overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="status-pill status-pill-success">
              <Clock3 className="size-3" />
              Live today
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Today command centre</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              One operational view for meetings, due work, blocked projects, overdue finance, and
              AI-guided next actions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={today.refetch}>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link to="/app/calendar">
                <CalendarDays className="mr-2 size-4" />
                Open calendar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {today.isError && (
        <section className="premium-card border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4" />
            Some Today data could not load
          </div>
          <p className="mt-2 text-sm">
            Refresh or open the source module if a section stays empty.
          </p>
        </section>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Meetings"
          value={today.isLoading ? '...' : today.todaysMeetings.length}
          detail="scheduled for today"
          icon={CalendarDays}
        />
        <MetricCard
          label="Due tasks"
          value={today.isLoading ? '...' : today.dueTasks.length}
          detail="open work due today"
          icon={Target}
        />
        <MetricCard
          label="Overdue invoices"
          value={today.isLoading ? '...' : today.overdueInvoices.length}
          detail="needs finance follow-up"
          icon={CircleDollarSign}
        />
        <MetricCard
          label="Blocked projects"
          value={today.isLoading ? '...' : today.blockedProjects.length}
          detail="marked blocked or at risk"
          icon={BriefcaseBusiness}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <section className="premium-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Suggested next actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ranked from real meetings, deadlines, blocked work, and overdue finance.
                </p>
              </div>
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-4 grid gap-3">
              {today.suggestedActions.length > 0 ? (
                today.suggestedActions.map((action) => (
                  <ActionCard key={action.id} action={action} />
                ))
              ) : (
                <div className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
                  Nothing urgent found. Add meeting times, task due dates, project statuses, and
                  invoice due dates to make Today smarter.
                </div>
              )}
            </div>
          </section>

          <section className="premium-card p-5">
            <h2 className="font-semibold">Today’s meetings</h2>
            <div className="mt-4 grid gap-3">
              {today.todaysMeetings.length > 0 ? (
                today.todaysMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/app/meetings/${meeting.id}`}
                    className="premium-interactive rounded-md border p-4 hover:bg-accent"
                  >
                    <p className="font-medium">{meeting.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatTime(meeting.startsAt)} ·{' '}
                      {meeting.location || meeting.videoUrl || 'No location'}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No meetings scheduled today.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-6">
          <section className="premium-card p-5">
            <div className="flex items-center gap-2">
              <Bot className="size-4" />
              <h2 className="font-semibold">Ask AI about today</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {[
                'What needs my attention today?',
                'Which projects are at risk?',
                'Who should I follow up with?',
                'What invoices are overdue?',
              ].map((question) => (
                <Link
                  key={question}
                  to="/app/ai"
                  onClick={() => askAi(question)}
                  className="premium-interactive rounded-md border px-3 py-3 text-sm hover:bg-accent"
                >
                  {question}
                </Link>
              ))}
            </div>
          </section>

          <section className="premium-card p-5">
            <h2 className="font-semibold">Due tasks</h2>
            <div className="mt-4 grid gap-3">
              {today.dueTasks.slice(0, 6).map((task) => (
                <Link
                  key={task.id}
                  to={`/app/tasks/${task.id}`}
                  className="rounded-md border p-3 text-sm"
                >
                  <span className="font-medium">{task.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {task.priority} · {task.project?.name ?? 'Project'}
                  </span>
                </Link>
              ))}
              {today.dueTasks.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No open tasks due today.
                </p>
              )}
            </div>
          </section>

          <section className="premium-card p-5">
            <h2 className="font-semibold">Overdue invoices</h2>
            <div className="mt-4 grid gap-3">
              {today.overdueInvoices.slice(0, 6).map((invoice) => (
                <Link key={invoice.id} to="/app/invoices" className="rounded-md border p-3 text-sm">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatMoney(invoice.balance ?? invoice.total, invoice.currency)} outstanding
                  </span>
                </Link>
              ))}
              {today.overdueInvoices.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No overdue invoices found.
                </p>
              )}
            </div>
          </section>

          <section className="premium-card p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-muted-foreground" />
              <p className="text-sm leading-6 text-muted-foreground">
                Today uses live CRM, project, meeting, and finance data. No sample records are
                shown.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
