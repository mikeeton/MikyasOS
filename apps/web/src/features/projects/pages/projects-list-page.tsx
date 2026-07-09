import { useQuery } from '@tanstack/react-query';
import { Grid2X2, List, Rows3, Plus, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { projectsApi, type Project } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
  formatDate,
  formatHours,
  formatMoney,
  initials,
  projectHealth,
} from '../components/project-format';
import { ProjectFilters } from '../components/project-filters';
import {
  ProjectEmptyState,
  ProjectErrorState,
  ProjectShell,
  ProjectSkeleton,
} from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

export function ProjectsListPage({ archive = false }: { archive?: boolean }) {
  const { token, organisationId, enabled } = useProjectsContext();
  const [view, setView] = useState<'grid' | 'table' | 'compact'>('grid');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(archive ? 'ARCHIVED' : '');
  const [priority, setPriority] = useState('');
  const projects = useQuery({
    queryKey: ['projects', 'list', organisationId, search, status, priority],
    queryFn: () =>
      projectsApi.projects(token!, organisationId!, { search, status, priority, pageSize: 50 }),
    enabled,
  });

  const items = projects.data?.items ?? [];
  const viewOptions: Array<{ name: 'grid' | 'table' | 'compact'; icon: LucideIcon }> = [
    { name: 'grid', icon: Grid2X2 },
    { name: 'table', icon: List },
    { name: 'compact', icon: Rows3 },
  ];

  return (
    <ProjectShell
      title={archive ? 'Project archive' : 'Project portfolio'}
      description="Switch between strategic cards, dense tables, and compact operational rows."
      actions={
        <Button asChild>
          <Link to="/app/projects/new">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create Project
          </Link>
        </Button>
      }
    >
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        viewToggle={
          <div className="flex rounded-md border border-border p-1">
            {viewOptions.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant={view === name ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView(name)}
              >
                <Icon className="mr-2 size-4" />
                {name}
              </Button>
            ))}
          </div>
        }
      />
      {projects.isLoading ? (
        <ProjectSkeleton rows={8} />
      ) : projects.isError ? (
        <ProjectErrorState onRetry={() => void projects.refetch()} />
      ) : items.length === 0 ? (
        <ProjectEmptyState
          title="No projects match this view"
          description="Create a new project or adjust filters to see operational workspaces."
          actionLabel="Create project"
          actionTo="/app/projects/new"
        />
      ) : view === 'table' ? (
        <ProjectTable projects={items} />
      ) : view === 'compact' ? (
        <div className="grid gap-2">
          {items.map((project) => (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}`}
              className="premium-row grid gap-3 rounded-md border border-border px-4 py-3 md:grid-cols-[1fr_auto_auto_auto]"
            >
              <span className="font-medium">{project.name}</span>
              <span className="text-sm text-muted-foreground">
                {project.owner?.name ?? 'No owner'}
              </span>
              <span className="text-sm">{project.priority}</span>
              <span className="text-sm text-muted-foreground">{formatDate(project.dueDate)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </ProjectShell>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="premium-card p-5 transition hover:border-foreground/20 hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-muted text-sm font-semibold">
          {initials(project.name)}
        </span>
        <span className="rounded bg-muted px-2 py-1 text-xs">{project.priority}</span>
      </div>
      <h3 className="mt-4 font-semibold">{project.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {project.company?.name ?? 'No CRM company'} · {project.owner?.name ?? 'No owner'}
      </p>
      <div className="mt-4 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Metric label="Health" value={projectHealth(project)} />
        <Metric label="Due" value={formatDate(project.dueDate)} />
        <Metric label="Tasks" value={project._count?.tasks ?? 0} />
      </div>
    </Link>
  );
}

function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-hidden premium-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-muted/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Health</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Hours</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="premium-row">
                <td className="px-4 py-3 font-medium">
                  <Link to={`/app/projects/${project.id}`}>{project.name}</Link>
                </td>
                <td className="px-4 py-3">{project.progress}%</td>
                <td className="px-4 py-3">{project.owner?.name ?? '—'}</td>
                <td className="px-4 py-3">{project.company?.name ?? '—'}</td>
                <td className="px-4 py-3">{project.priority}</td>
                <td className="px-4 py-3">{projectHealth(project)}</td>
                <td className="px-4 py-3">{formatDate(project.dueDate)}</td>
                <td className="px-4 py-3">{formatMoney(project.budget)}</td>
                <td className="px-4 py-3">{formatHours(project.estimatedHours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      <span className="block text-xs text-muted-foreground">{label}</span>
      {value}
    </span>
  );
}
