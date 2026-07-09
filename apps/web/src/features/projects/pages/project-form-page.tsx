import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { projectsApi, type Project } from '@/api/client';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/query-client';
import { omitBlankValues } from '@/features/crm/components/crm-form-values';
import { ProjectShell } from '../components/project-shell';
import { useProjectsContext } from '../hooks/use-projects-context';

export function ProjectFormPage() {
  const navigate = useNavigate();
  const { token, organisationId } = useProjectsContext();
  const mutation = useMutation({
    mutationFn: (body: Partial<Project>) =>
      projectsApi.createProject(token!, organisationId!, body),
    onSuccess: (project) => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      void navigate(`/app/projects/${project.id}`);
    },
  });

  return (
    <ProjectShell
      title="Create project"
      description="Start a living workspace with owner, priority, delivery window, budget, and capacity expectations."
    >
      <form
        className="grid gap-6 premium-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const raw = Object.fromEntries(new FormData(event.currentTarget));
          mutation.mutate(omitBlankValues(raw));
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project name">
            <input name="name" className="premium-input" required minLength={2} />
          </Field>
          <Field label="Status">
            <select name="status" className="premium-input" defaultValue="ACTIVE">
              {['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED'].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select name="priority" className="premium-input" defaultValue="MEDIUM">
              {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </Field>
          <Field label="Progress">
            <input
              name="progress"
              type="number"
              min={0}
              max={100}
              defaultValue={0}
              className="premium-input"
            />
          </Field>
          <Field label="Budget">
            <input name="budget" type="number" min={0} className="premium-input" />
          </Field>
          <Field label="Estimated hours">
            <input name="estimatedHours" type="number" min={0} className="premium-input" />
          </Field>
          <Field label="Start date">
            <input name="startDate" type="date" className="premium-input" />
          </Field>
          <Field label="Due date">
            <input name="dueDate" type="date" className="premium-input" />
          </Field>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          <span>Description</span>
          <textarea name="description" rows={5} className="premium-input min-h-28 py-2" />
        </label>
        {mutation.error ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Project workspace, activity, and future AI context will be prepared automatically.
          </p>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create project'}
          </Button>
        </div>
      </form>
    </ProjectShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
