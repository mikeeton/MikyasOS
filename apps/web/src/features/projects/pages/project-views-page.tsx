import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import { projectsApi, type Task } from '@/api/client';
import { queryClient } from '@/lib/query-client';
import { ProjectAiCards } from '../components/ai/project-ai-cards';
import { formatDate, formatHours } from '../components/project-format';
import { projectSpring } from '../components/project-motion-config';
import { MotionGroup, MotionItem } from '../components/project-motion';
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
  const { token, organisationId } = useProjectsContext();
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const moveTask = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      projectsApi.moveTask(token!, organisationId!, taskId, {
        projectId: data.project?.id,
        status,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} board`}
      description="Primary board view prepared for drag-and-drop, keyboard movement, multi-select, bulk move, and quick edit."
    >
      {moveTask.isError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Could not move task. Please try again.
        </p>
      ) : null}
      <MotionGroup className="grid gap-4 overflow-x-auto xl:grid-cols-6">
        {boardColumns.map(([label, status]) => (
          <motion.section
            key={label}
            className="project-drop-zone min-h-[30rem] min-w-64 premium-card p-3"
            data-drag-over={dragOverStatus === status}
            layout
            transition={projectSpring}
            onDragEnter={() => setDragOverStatus(status)}
            onDragLeave={() =>
              setDragOverStatus((current) => (current === status ? null : current))
            }
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverStatus(status);
            }}
            onDrop={(event) => {
              event.preventDefault();
              const taskId = event.dataTransfer.getData('text/task-id') || draggingTaskId;
              if (taskId) {
                moveTask.mutate({ taskId, status });
              }
              setDraggingTaskId(null);
              setDragOverStatus(null);
            }}
          >
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
                  <TaskCard
                    key={task.id}
                    task={task}
                    dragging={draggingTaskId === task.id}
                    onDragStart={() => setDraggingTaskId(task.id)}
                    onDragEnd={() => {
                      setDraggingTaskId(null);
                      setDragOverStatus(null);
                    }}
                  />
                ))}
            </div>
          </motion.section>
        ))}
      </MotionGroup>
      <ProjectAiPlaceholder title="AI board recommendations placeholder" />
      <ProjectAiCards limit={3} />
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
              <motion.tr
                key={task.id}
                className="premium-row"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={projectSpring}
              >
                <td className="px-4 py-3 font-medium">
                  <Link to={`/app/tasks/${task.id}`}>{task.title}</Link>
                </td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">{task.priority}</td>
                <td className="px-4 py-3">{task.assignee?.name ?? 'Unassigned'}</td>
                <td className="px-4 py-3">{formatDate(task.dueDate)}</td>
                <td className="px-4 py-3">{formatHours(task.estimatedHours)}</td>
              </motion.tr>
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
        <MotionGroup className="mt-6 grid gap-4">
          {[...(data.project?.milestones ?? []), ...data.tasks].slice(0, 12).map((item) => (
            <MotionItem key={item.id} className="grid gap-2 md:grid-cols-[10rem_1fr]">
              <span className="text-sm text-muted-foreground">
                {formatDate('dueDate' in item ? item.dueDate : undefined)}
              </span>
              <div className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">{'title' in item ? item.title : 'Milestone'}</p>
              </div>
            </MotionItem>
          ))}
        </MotionGroup>
      </section>
      <ProjectAiPlaceholder title="Critical path placeholder" />
    </ProjectShell>
  );
}

export function ProjectCalendarPage() {
  const data = useProjectViewData();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  if (data.loading) return <ProjectSkeleton rows={8} />;
  if (data.error) return <ProjectErrorState onRetry={data.retry} />;

  const scheduled = data.tasks.filter((task) => task.dueDate);
  const month = new Date();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return new Date(month.getFullYear(), month.getMonth(), day).toISOString().slice(0, 10);
    }),
  ];
  const selectedTasks = scheduled.filter((task) => task.dueDate?.slice(0, 10) === selectedDate);

  return (
    <ProjectShell
      title={`${data.project?.name ?? 'Project'} calendar`}
      description="Calendar architecture for tasks, deadlines, milestones, future meetings, leave, agenda view, and drag-to-reschedule."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <section className="premium-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h3>
            <span className="rounded bg-muted px-2 py-1 text-xs">{selectedDate}</span>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarCells.map((date, index) =>
              date ? (
                <motion.button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-20 rounded-md border border-border p-2 text-left text-sm transition hover:bg-accent ${
                    selectedDate === date ? 'border-primary bg-primary/10' : ''
                  }`}
                  layout
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={projectSpring}
                >
                  <span className="font-medium">{Number(date.slice(8, 10))}</span>
                  {scheduled.some((task) => task.dueDate?.slice(0, 10) === date) ? (
                    <span className="mt-2 block h-1.5 w-8 rounded-full bg-primary" />
                  ) : null}
                </motion.button>
              ) : (
                <span key={`empty-${index}`} />
              ),
            )}
          </div>
        </section>
        <section className="premium-card p-5">
          <h3 className="font-semibold">Agenda</h3>
          <div className="mt-4 grid gap-2">
            {(selectedTasks.length ? selectedTasks : scheduled.slice(0, 10)).map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
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
              </motion.div>
            ))}
            {scheduled.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scheduled tasks yet.</p>
            ) : null}
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
        <MotionGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(workload.data ?? []).map((row) => (
            <MotionItem key={row.user.id} className="premium-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{row.user.name}</h3>
                <span className="rounded bg-muted px-2 py-1 text-xs">{row.capacityStatus}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {row.openTasks} open tasks · {row.estimatedHours}h
              </p>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div
                  className="project-capacity-bar h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (row.estimatedHours / 40) * 100)}%` }}
                />
              </div>
            </MotionItem>
          ))}
        </MotionGroup>
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

function TaskCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layout
      whileHover={reduceMotion ? undefined : { y: -4, rotateX: 1.5, rotateY: -1.5 }}
      animate={dragging ? { scale: 1.03, rotate: -0.6 } : { scale: 1, rotate: 0 }}
      transition={projectSpring}
    >
      <Link
        to={`/app/tasks/${task.id}`}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('text/task-id', task.id);
          event.dataTransfer.effectAllowed = 'move';
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        className="block rounded-md border border-border bg-muted/30 p-3 text-sm transition hover:bg-accent"
      >
        <p className="font-medium">{task.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {task.priority} · {task.assignee?.name ?? 'Unassigned'}
        </p>
      </Link>
    </motion.div>
  );
}
