import { useMutation, useQuery } from '@tanstack/react-query';
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
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';

import { projectsApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { ProjectAiCards } from '../components/ai/project-ai-cards';
import { formatDate, formatHours, formatMoney, projectHealth } from '../components/project-format';
import { projectSpring } from '../components/project-motion-config';
import { MotionGroup, MotionItem } from '../components/project-motion';
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

      <MotionGroup className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
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
            <QuickTaskForm projectId={item.id} />
            <MotionGroup className="grid gap-2">
              {tasks.slice(0, 8).map((task) => (
                <MotionItem key={task.id}>
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
                </MotionItem>
              ))}
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : null}
            </MotionGroup>
          </Panel>
          <Panel title="Activity Timeline" icon={CalendarDays}>
            <MotionGroup className="grid gap-3">
              {(item.activities ?? []).slice(0, 8).map((activity) => (
                <MotionItem key={activity.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.type} · {formatDate(activity.createdAt)}
                  </p>
                </MotionItem>
              ))}
            </MotionGroup>
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
            <ProjectFileUploader projectId={item.id} />
            <div className="mt-4 grid gap-2">
              {(item.files ?? []).slice(0, 5).map((file) => (
                <div key={file.id} className="rounded-md border border-border p-3 text-sm">
                  <span className="font-medium">{file.originalFilename}</span>
                  <span className="block text-xs text-muted-foreground">{file.mimeType}</span>
                </div>
              ))}
              {(item.files ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No files attached.</p>
              ) : null}
            </div>
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
      </MotionGroup>
      <ProjectAiCards />
    </ProjectShell>
  );
}

function QuickTaskForm({ projectId }: { projectId: string }) {
  const { token, organisationId } = useProjectsContext();
  const createTask = useMutation({
    mutationFn: (body: { title: string; projectId: string; priority: string; status: string }) =>
      projectsApi.createTask(token!, organisationId!, body),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return (
    <form
      className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const titleValue = form.get('title');
        const title = typeof titleValue === 'string' ? titleValue.trim() : '';
        if (title) {
          createTask.mutate({ projectId, title, priority: 'MEDIUM', status: 'TODO' });
          event.currentTarget.reset();
        }
      }}
    >
      <input name="title" className="premium-input" placeholder="Add a task..." />
      <Button type="submit" variant="outline" disabled={createTask.isPending}>
        {createTask.isPending ? 'Adding...' : 'Add task'}
      </Button>
      {createTask.error ? (
        <p className="text-sm text-destructive sm:col-span-2">{createTask.error.message}</p>
      ) : null}
    </form>
  );
}

function ProjectFileUploader({ projectId }: { projectId: string }) {
  const { token, organisationId } = useProjectsContext();
  const upload = useMutation({
    mutationFn: (file: File) =>
      projectsApi.createFile(token!, organisationId!, {
        projectId,
        storageKey: `local-placeholder/${projectId}/${crypto.randomUUID()}-${file.name}`,
        originalFilename: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const file = new FormData(event.currentTarget).get('file');
        if (file instanceof File && file.size > 0) {
          upload.mutate(file);
          event.currentTarget.reset();
        }
      }}
    >
      <input name="file" type="file" className="premium-input text-sm" />
      {upload.error ? <p className="text-xs text-destructive">{upload.error.message}</p> : null}
      <Button type="submit" variant="outline" size="sm" disabled={upload.isPending}>
        {upload.isPending ? 'Adding file...' : 'Add file'}
      </Button>
      <p className="text-xs text-muted-foreground">
        Stores file metadata now; binary storage can attach to the same record later.
      </p>
    </form>
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
    <motion.section
      className="premium-card p-5"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={projectSpring}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </motion.section>
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
