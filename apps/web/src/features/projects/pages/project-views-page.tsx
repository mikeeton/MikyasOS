import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { projectsApi, type Task } from '@/api/client';
import { formatDate, formatHours } from '../components/project-format';
import {
  ProjectAiPlaceholder,
  ProjectErrorState,
  ProjectShell,
  ProjectSkeleton,
} from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

const boardColumns = [
  ['Backlog', 'TODO'],
  ['Todo', 'TODO'],
  ['In Progress', 'IN_PROGRESS'],
  ['Review', 'IN_REVIEW'],
  ['Testing', 'BLOCKED'],
  ['Completed', 'DONE'],
] as const;

export function ProjectBoardPage() {
  const data = useProjectViewData();
  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} board`}
      description="Primary board view prepared for drag-and-drop, keyboard movement, multi-select, bulk move, and quick edit."
    >
      <div className="grid gap-4 overflow-x-auto xl:grid-cols-6">
        {boardColumns.map(([label, status]) => (
          <section key={label} className="min-h-[30rem] min-w-64 premium-card p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{label}</h3>
              <span className="rounded bg-muted px-2 py-1 text-xs">
                {data.tasks.filter((task) => task.status === status).length}
              </span>
            </div>
            <div className="mt-3 grid gap-3">
              {data.tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </section>
        ))}
      </div>
      <ProjectAiPlaceholder title="AI board recommendations placeholder" />
    </ProjectShell>
  );
}

export function ProjectTaskListPage() {
  const data = useProjectViewData();
  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} task list`}
      description="Professional table prepared for grouping, sorting, filtering, saved filters, bulk actions, and inline editing."
    >
      <div className="overflow-hidden premium-card">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Estimated</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.map((task) => (
              <tr key={task.id} className="premium-row">
                <td className="px-4 py-3 font-medium">
                  <Link to={`/app/tasks/${task.id}`}>{task.title}</Link>
                </td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">{task.priority}</td>
                <td className="px-4 py-3">{task.assignee?.name ?? 'Unassigned'}</td>
                <td className="px-4 py-3">{formatDate(task.dueDate)}</td>
                <td className="px-4 py-3">{formatHours(task.estimatedHours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProjectShell>
  );
}

export function ProjectTimelinePage() {
  const data = useProjectViewData();
  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} timeline`}
      description="Roadmap view for milestones, task dependencies, critical path placeholder, progress, and day/week/month/quarter zoom levels."
    >
      <section className="premium-card p-5">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {['Day', 'Week', 'Month', 'Quarter'].map((zoom) => (
            <span key={zoom} className="rounded border border-border px-3 py-1">
              {zoom}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-4">
          {[...(data.project?.milestones ?? []), ...data.tasks].slice(0, 12).map((item) => (
            <div key={item.id} className="grid gap-2 md:grid-cols-[10rem_1fr]">
              <span className="text-sm text-muted-foreground">
                {formatDate('dueDate' in item ? item.dueDate : undefined)}
              </span>
              <div className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">{'title' in item ? item.title : 'Milestone'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ProjectAiPlaceholder title="Critical path placeholder" />
    </ProjectShell>
  );
}

export function ProjectCalendarPage() {
  const data = useProjectViewData();
  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  const scheduled = data.tasks.filter((task) => task.dueDate);
  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} calendar`}
      description="Calendar architecture for tasks, deadlines, milestones, future meetings, leave, agenda view, and drag-to-reschedule."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <section className="premium-card grid min-h-[28rem] place-items-center p-5 text-center">
          <CalendarDays className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Month / Week / Day calendar prepared</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Interactive calendar rendering comes in a later UI pass.
          </p>
        </section>
        <section className="premium-card p-5">
          <h3 className="font-semibold">Agenda</h3>
          <div className="mt-4 grid gap-2">
            {scheduled.slice(0, 10).map((task) => (
              <Link
                key={task.id}
                to={`/app/tasks/${task.id}`}
                className="rounded-md border border-border p-3 text-sm"
              >
                {task.title}
                <span className="block text-xs text-muted-foreground">
                  {formatDate(task.dueDate)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </ProjectShell>
  );
}

export function ProjectWorkloadPage() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useProjectsContext();
  const workload = useQuery({
    queryKey: ['projects', 'workload', organisationId, id],
    queryFn: () => projectsApi.workload(token!, organisationId!),
    enabled,
  });

  return (
    <ProjectShell
      title="Team workload"
      description="Utilisation by employee with assigned tasks, estimated hours, capacity, availability, and future AI workload suggestions."
    >
      {workload.isLoading ? (
        <ProjectSkeleton rows={7} />
      ) : workload.isError ? (
        <ProjectErrorState onRetry={() => void workload.refetch()} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(workload.data ?? []).map((row) => (
            <section key={row.user.id} className="premium-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{row.user.name}</h3>
                <span className="rounded bg-muted px-2 py-1 text-xs">{row.capacityStatus}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {row.openTasks} open tasks · {row.estimatedHours}h
              </p>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (row.estimatedHours / 40) * 100)}%` }}
                />
              </div>
            </section>
          ))}
        </div>
      )}
      <ProjectAiPlaceholder title="AI workload suggestions placeholder" />
    </ProjectShell>
  );
}

function useProjectViewData() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useProjectsContext();
  const project = useQuery({
    queryKey: ['projects', 'detail', organisationId, id],
    queryFn: () => projectsApi.project(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
  const tasks = useQuery({
    queryKey: ['projects', 'tasks', organisationId, id],
    queryFn: () => projectsApi.tasks(token!, organisationId!, { projectId: id, pageSize: 100 }),
    enabled: enabled && Boolean(id),
  });

  return {
    project: project.data,
    tasks: tasks.data?.items ?? [],
    loading: project.isLoading || tasks.isLoading,
    error: project.isError || tasks.isError,
    retry: () => {
      void project.refetch();
      void tasks.refetch();
    },
  };
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      to={`/app/tasks/${task.id}`}
      className="rounded-md border border-border bg-muted/30 p-3 text-sm transition hover:bg-accent"
    >
      <p className="font-medium">{task.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {task.priority} · {task.assignee?.name ?? 'Unassigned'}
      </p>
    </Link>
  );
}
