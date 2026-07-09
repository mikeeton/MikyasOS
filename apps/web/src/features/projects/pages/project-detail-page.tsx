import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  Edit,
  FileText,
  Flag,
  Link2,
  ListChecks,
  Timer,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router';

import { projectsApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { formatDate, formatHours, formatMoney, projectHealth } from '../components/project-format';
import {
  ProjectAiPlaceholder,
  ProjectErrorState,
  ProjectShell,
  ProjectSkeleton,
  ProjectStat,
} from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

export function ProjectDetailPage() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useProjectsContext();
  const project = useQuery({
    queryKey: ['projects', 'detail', organisationId, id],
    queryFn: () => projectsApi.project(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });

  if (project.isLoading) return <ProjectSkeleton rows={8} />;
  if (project.isError || !project.data)
    return <ProjectErrorState onRetry={() => void project.refetch()} />;

  const item = project.data;
  const tasks = item.tasks ?? [];
  const openTasks = tasks.filter((task) => task.status !== 'DONE');

  return (
    <ProjectShell
      title={item.name}
      description={
        item.description ??
        'A connected project workspace for tasks, files, milestones, comments, activity, CRM context, and future intelligence.'
      }
      actions={
        <>
          <Button asChild>
            <Link to={`/app/projects/${item.id}/board`}>
              <ListChecks className="mr-2 size-4" aria-hidden="true" />
              Open Board
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/app/projects/${item.id}/settings`}>
              <Edit className="mr-2 size-4" aria-hidden="true" />
              Settings
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ProjectStat label="Progress" value={`${item.progress}%`} hint="Completion percentage" />
        <ProjectStat label="Open Tasks" value={openTasks.length} hint="Still in motion" />
        <ProjectStat label="Health" value={projectHealth(item, tasks)} hint="Risk signal" />
        <ProjectStat label="Budget" value={formatMoney(item.budget)} hint="Planned budget" />
        <ProjectStat
          label="Estimated"
          value={formatHours(item.estimatedHours)}
          hint="Delivery capacity"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <section className="grid gap-6">
          <Panel title="Project Overview" icon={Flag}>
            <div className="grid gap-4 md:grid-cols-3">
              <Fact label="Status" value={item.status} />
              <Fact label="Priority" value={item.priority} />
              <Fact label="Owner" value={item.owner?.name ?? 'No owner'} />
              <Fact label="Start" value={formatDate(item.startDate)} />
              <Fact label="Due" value={formatDate(item.dueDate)} />
              <Fact label="Actual hours" value={formatHours(item.actualHours)} />
            </div>
          </Panel>
          <Panel title="Tasks" icon={ListChecks}>
            <div className="grid gap-2">
              {tasks.slice(0, 8).map((task) => (
                <Link
                  key={task.id}
                  to={`/app/tasks/${task.id}`}
                  className="premium-row flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span>{task.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {task.status} · {task.priority}
                  </span>
                </Link>
              ))}
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : null}
            </div>
          </Panel>
          <Panel title="Activity Timeline" icon={CalendarDays}>
            <div className="grid gap-3">
              {(item.activities ?? []).slice(0, 8).map((activity) => (
                <div key={activity.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.type} · {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
        <aside className="grid content-start gap-4">
          <Panel title="Linked CRM Company" icon={Link2}>
            <p className="text-sm text-muted-foreground">
              {item.company?.name ?? 'No company linked yet.'}
            </p>
          </Panel>
          <Panel title="Milestones" icon={Flag}>
            <p className="text-sm text-muted-foreground">
              {item.milestones?.length ?? 0} milestones prepared.
            </p>
          </Panel>
          <Panel title="Files" icon={FileText}>
            <p className="text-sm text-muted-foreground">
              {item.files?.length ?? 0} files attached.
            </p>
          </Panel>
          <Panel title="Time Tracking" icon={Timer}>
            <p className="text-sm text-muted-foreground">
              Manual entries and timer architecture are ready.
            </p>
          </Panel>
          <Panel title="Team Members" icon={UsersRound}>
            <p className="text-sm text-muted-foreground">
              {item.owner?.name ?? 'Owner'} leads this workspace.
            </p>
          </Panel>
          <ProjectAiPlaceholder title="AI Workspace Placeholder" />
        </aside>
      </div>
    </ProjectShell>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="premium-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
