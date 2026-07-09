import { Link, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { ProjectShell } from '../components/project-shell';

export function ProjectSettingsPage() {
  const { id } = useParams();

  return (
    <ProjectShell
      title="Project settings"
      description="Settings architecture for ownership, CRM link, budget, access, notifications, and archive controls."
      actions={
        <Button asChild variant="outline">
          <Link to={`/app/projects/${id}`}>Back to project</Link>
        </Button>
      }
    >
      <section className="premium-card p-5">
        <h3 className="font-semibold">Settings prepared</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Editable settings will connect in the next refinement pass. The backend already supports
          project updates, archive, restore, and ownership changes.
        </p>
      </section>
    </ProjectShell>
  );
}
