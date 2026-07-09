import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Plus } from 'lucide-react';
import { Link } from 'react-router';

import { projectsApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { formatDate, formatHours } from '../components/project-format';
import {
  ProjectEmptyState,
  ProjectErrorState,
  ProjectShell,
  ProjectSkeleton,
} from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

export function TasksPage() {
  const { token, organisationId, enabled } = useProjectsContext();
  const tasks = useQuery({
    queryKey: ['projects', 'tasks', organisationId, 'all'],
    queryFn: () => projectsApi.tasks(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });

  const items = tasks.data?.items ?? [];

  return (
    <ProjectShell
      eyebrow="Tasks"
      title="Task command queue"
      description="Every active task across your projects, grouped into one operational queue."
      actions={
        <Button asChild>
          <Link to="/app/projects">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Open Projects
          </Link>
        </Button>
      }
    >
      {tasks.isLoading ? (
        <ProjectSkeleton rows={8} />
      ) : tasks.isError ? (
        <ProjectErrorState onRetry={() => void tasks.refetch()} />
      ) : items.length === 0 ? (
        <ProjectEmptyState
          title="No tasks yet"
          description="Create a project first, then add tasks from the project workspace."
          actionLabel="Open projects"
          actionTo="/app/projects"
        />
      ) : (
        <div className="overflow-hidden premium-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-sm">
              <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Estimated</th>
                </tr>
              </thead>
              <tbody>
                {items.map((task) => (
                  <tr key={task.id} className="premium-row">
                    <td className="px-4 py-3 font-medium">
                      <Link to={`/app/tasks/${task.id}`} className="inline-flex items-center gap-2">
                        {task.status === 'DONE' ? (
                          <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
                        ) : null}
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {task.project ? (
                        <Link to={`/app/projects/${task.project.id}`}>{task.project.name}</Link>
                      ) : (
                        'No project'
                      )}
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
        </div>
      )}
    </ProjectShell>
  );
}
