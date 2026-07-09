import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  FileUp,
  Flag,
  ListChecks,
  Plus,
  Search,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { identityApi, projectsApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { formatDate, projectHealth } from '../components/project-format';
import { projectSpring } from '../components/project-motion-config';
import { MotionGroup, MotionItem } from '../components/project-motion';
import {
  ProjectAiPlaceholder,
  ProjectEmptyState,
  ProjectErrorState,
  ProjectShell,
  ProjectSkeleton,
  ProjectStat,
} from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

export function ProjectsDashboardPage() {
  const { token, organisationId, enabled } = useProjectsContext();
  const [inviteOpen, setInviteOpen] = useState(false);
  const projects = useQuery({
    queryKey: ['projects', 'dashboard', organisationId],
    queryFn: () => projectsApi.projects(token!, organisationId!, { pageSize: 50 }),
    enabled,
  });
  const tasks = useQuery({
    queryKey: ['projects', 'tasks', organisationId, 'dashboard'],
    queryFn: () => projectsApi.tasks(token!, organisationId!, { pageSize: 100 }),
    enabled,
  });
  const workload = useQuery({
    queryKey: ['projects', 'workload', organisationId],
    queryFn: () => projectsApi.workload(token!, organisationId!),
    enabled,
  });
  const activities = useQuery({
    queryKey: ['projects', 'activities', organisationId, 'dashboard'],
    queryFn: () => projectsApi.activities(token!, organisationId!, { pageSize: 8 }),
    enabled,
  });
  const roles = useQuery({
    queryKey: ['identity', 'roles', organisationId],
    queryFn: () => identityApi.roles(token!, organisationId!),
    enabled: enabled && inviteOpen,
  });
  const invite = useMutation({
    mutationFn: (body: { email: string; roleId: string }) =>
      identityApi.inviteUser(token!, organisationId!, body),
  });

  const projectItems = projects.data?.items ?? [];
  const taskItems = tasks.data?.items ?? [];
  const now = new Date();
  const overdueTasks = taskItems.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE',
  );
  const blockedTasks = taskItems.filter((task) => task.status === 'BLOCKED');
  const activeProjects = projectItems.filter((project) => project.status === 'ACTIVE');

  return (
    <ProjectShell
      title="Projects command centre"
      description="See what is moving, what is blocked, who owns the work, and what needs attention next."
      actions={
        <>
          <Button asChild>
            <Link to="/app/projects/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Create Project
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/projects/list">
              <Search className="mr-2 size-4" aria-hidden="true" />
              Browse Projects
            </Link>
          </Button>
        </>
      }
    >
      {projects.isLoading || tasks.isLoading ? (
        <ProjectSkeleton rows={7} />
      ) : projects.isError || tasks.isError ? (
        <ProjectErrorState
          onRetry={() => {
            void projects.refetch();
            void tasks.refetch();
          }}
        />
      ) : projectItems.length === 0 ? (
        <ProjectEmptyState
          title="Create your first project workspace"
          description="Projects connect customers, tasks, milestones, files, comments, workload, and activity into one operational centre."
          actionLabel="Create project"
          actionTo="/app/projects/new"
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProjectStat
              label="Total Projects"
              value={projects.data?.pagination.total ?? 0}
              hint="All project workspaces"
            />
            <ProjectStat
              label="In Progress"
              value={activeProjects.length}
              hint="Currently active"
              tone="success"
            />
            <ProjectStat
              label="Completed"
              value={projectItems.filter((item) => item.status === 'COMPLETED').length}
              hint="Finished projects"
            />
            <ProjectStat
              label="Overdue Tasks"
              value={overdueTasks.length}
              hint="Past due and incomplete"
              tone="warning"
            />
            <ProjectStat
              label="Today's Tasks"
              value={
                taskItems.filter(
                  (task) => task.dueDate?.slice(0, 10) === new Date().toISOString().slice(0, 10),
                ).length
              }
              hint="Due today"
            />
            <ProjectStat
              label="Blocked Tasks"
              value={blockedTasks.length}
              hint="Need intervention"
              tone="warning"
            />
            <ProjectStat
              label="Upcoming Milestones"
              value={projectItems.reduce(
                (count, project) => count + (project._count?.milestones ?? 0),
                0,
              )}
              hint="Planned checkpoints"
            />
            <ProjectStat
              label="Project Health"
              value={
                activeProjects.filter((project) => projectHealth(project) === 'Healthy').length
              }
              hint="Healthy active projects"
              tone="success"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <MotionItem className="premium-card p-5">
              <h3 className="font-semibold">Priority Projects</h3>
              <MotionGroup className="mt-4 grid gap-3">
                {projectItems.slice(0, 6).map((project) => (
                  <motion.div key={project.id} layout transition={projectSpring}>
                    <Link
                      key={project.id}
                      to={`/app/projects/${project.id}`}
                      className="premium-row flex items-center justify-between rounded-md border border-border px-3 py-3"
                    >
                      <span>
                        <span className="block text-sm font-medium">{project.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {project.owner?.name ?? 'No owner'} · due {formatDate(project.dueDate)}
                        </span>
                      </span>
                      <span className="rounded bg-muted px-2 py-1 text-xs">
                        {projectHealth(project)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </MotionGroup>
            </MotionItem>
            <section className="grid gap-4">
              <ProjectAiPlaceholder title="AI Project Insights" />
              <ProjectAiPlaceholder title="AI Recommendations" />
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <MotionItem className="premium-card p-5 xl:col-span-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <MotionGroup className="mt-4 grid gap-3">
                {(activities.data ?? []).map((activity) => (
                  <MotionItem key={activity.id} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.type} · {formatDate(activity.createdAt)}
                    </p>
                  </MotionItem>
                ))}
              </MotionGroup>
            </MotionItem>
            <MotionItem className="premium-card p-5">
              <h3 className="font-semibold">Team Workload</h3>
              <MotionGroup className="mt-4 grid gap-3">
                {(workload.data ?? []).slice(0, 5).map((row) => (
                  <MotionItem
                    key={row.user.id}
                    className="rounded-md border border-border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{row.user.name}</span>
                      <span className="text-xs text-muted-foreground">{row.capacityStatus}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.openTasks} tasks · {row.estimatedHours}h estimated
                    </p>
                  </MotionItem>
                ))}
              </MotionGroup>
            </MotionItem>
          </div>

          <MotionGroup className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <QuickAction icon={Plus} label="Create Project" to="/app/projects/new" />
            <QuickAction icon={ListChecks} label="Create Task" to="/app/projects/list" />
            <QuickAction
              icon={UsersRound}
              label="Invite Team Member"
              onClick={() => setInviteOpen(true)}
            />
            <QuickAction icon={FileUp} label="Upload Project File" to="/app/projects/list" />
            <QuickAction icon={Flag} label="Create Milestone" to="/app/projects/list" />
            <QuickAction icon={CalendarDays} label="Open Calendar" to="/app/projects/list" />
            <QuickAction icon={Search} label="Generate Status Report" to="/app/projects/list" />
          </MotionGroup>
          <AnimatePresence>
            {inviteOpen ? (
              <motion.div
                className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.form
                  className="premium-card w-full max-w-md p-5"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={projectSpring}
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    const emailValue = form.get('email');
                    const roleIdValue = form.get('roleId');
                    const email = typeof emailValue === 'string' ? emailValue : '';
                    const roleId = typeof roleIdValue === 'string' ? roleIdValue : '';
                    invite.mutate({ email, roleId });
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">Invite team member</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Send an organisation invite using the existing role system.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setInviteOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-2 text-sm font-medium">
                      Email
                      <input name="email" type="email" required className="premium-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Role
                      <select name="roleId" required className="premium-input">
                        {(roles.data ?? []).map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {roles.isLoading ? (
                      <p className="text-sm text-muted-foreground">Loading roles...</p>
                    ) : null}
                    {invite.error ? (
                      <p className="text-sm text-destructive">{invite.error.message}</p>
                    ) : null}
                    {invite.isSuccess ? (
                      <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                        Invite created. The returned invite token is ready for an email delivery
                        pass.
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      disabled={invite.isPending || roles.isLoading || !roles.data?.length}
                    >
                      {invite.isPending ? 'Inviting...' : 'Send invite'}
                    </Button>
                  </div>
                </motion.form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </ProjectShell>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </>
  );

  if (to) {
    return (
      <MotionItem>
        <Button asChild variant="outline" className="h-16 w-full justify-start gap-3">
          <Link to={to}>{content}</Link>
        </Button>
      </MotionItem>
    );
  }

  return (
    <MotionItem>
      <Button
        type="button"
        variant="outline"
        className="h-16 w-full justify-start gap-3"
        onClick={onClick}
      >
        {content}
      </Button>
    </MotionItem>
  );
}
