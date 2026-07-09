import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  FileText,
  GitBranch,
  MessageSquare,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router';

import { projectsApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
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

export function TaskDetailPage() {
  const { id } = useParams();
  const { token, organisationId, enabled } = useProjectsContext();
  const task = useQuery({
    queryKey: ['projects', 'task', organisationId, id],
    queryFn: () => projectsApi.task(token!, organisationId!, id!),
    enabled: enabled && Boolean(id),
  });
  const complete = useMutation({
    mutationFn: () => projectsApi.completeTask(token!, organisationId!, id!),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  if (task.isLoading) return <ProjectSkeleton rows={7} />;
  if (task.isError || !task.data) return <ProjectErrorState onRetry={() => void task.refetch()} />;

  const item = task.data;

  return (
    <ProjectShell
      eyebrow="Task"
      title={item.title}
      description={
        item.description ??
        'Task workspace with subtasks, comments, files, history, time tracking, and future AI suggestions.'
      }
      actions={
        <>
          <Button
            onClick={() => complete.mutate()}
            disabled={complete.isPending || item.status === 'DONE'}
          >
            <CheckCircle2 className="mr-2 size-4" aria-hidden="true" />
            Complete
          </Button>
          <Button asChild variant="outline">
            <Link to={`/app/projects/${item.projectId}`}>Open project</Link>
          </Button>
        </>
      }
    >
      <MotionGroup className="grid gap-6 xl:grid-cols-[1.3fr_0.75fr]">
        <section className="grid gap-6">
          <Panel title="Description" icon={FileText}>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description ?? 'No description yet.'}
            </p>
          </Panel>
          <Panel title="Subtasks and checklist" icon={GitBranch}>
            <MotionGroup className="grid gap-2">
              {(item.subtasks ?? []).map((subtask) => (
                <MotionItem
                  key={subtask.id}
                  className="rounded-md border border-border p-3 text-sm"
                >
                  {subtask.title}
                </MotionItem>
              ))}
              {(item.subtasks ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No subtasks yet.</p>
              ) : null}
            </MotionGroup>
          </Panel>
          <Panel title="Comments" icon={MessageSquare}>
            <MotionGroup className="grid gap-2">
              {(item.comments ?? []).map((comment) => (
                <MotionItem
                  key={comment.id}
                  className="rounded-md border border-border p-3 text-sm"
                >
                  {comment.content}
                </MotionItem>
              ))}
              {(item.comments ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : null}
            </MotionGroup>
          </Panel>
        </section>
        <aside className="grid content-start gap-4">
          <Panel title="Task Facts" icon={CheckCircle2}>
            <div className="grid gap-3 text-sm">
              <Fact label="Status" value={item.status} />
              <Fact label="Priority" value={item.priority} />
              <Fact label="Assignee" value={item.assignee?.name ?? 'Unassigned'} />
              <Fact label="Reporter" value={item.reporter?.name ?? 'Unknown'} />
              <Fact label="Due date" value={formatDate(item.dueDate)} />
              <Fact label="Estimated" value={formatHours(item.estimatedHours)} />
            </div>
          </Panel>
          <Panel title="Time tracking" icon={Timer}>
            <p className="text-sm text-muted-foreground">
              {item.timeEntries?.length ?? 0} entries recorded.
            </p>
          </Panel>
          <ProjectAiPlaceholder title="Future AI task suggestions" />
        </aside>
      </MotionGroup>
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
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
