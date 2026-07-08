import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { identityApi } from '@/api/client';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { formString } from '@/lib/form-data';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

const industries = ['Professional services', 'Retail', 'Healthcare', 'Technology', 'Education'];
const sizes = ['1-10', '11-50', '51-200', '201-1000', '1000+'];

export function OnboardingPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof identityApi.createOrganisation>[1]) =>
      identityApi.createOrganisation(token!, body),
    onSuccess: (organisation) => {
      if (user) {
        setUser({ ...user, activeOrganisationId: organisation.id });
      }
      void queryClient.invalidateQueries({ queryKey: ['organisations'] });
      void navigate('/app');
    },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <form
        className="mx-auto grid max-w-2xl gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          mutation.mutate({
            name: formString(form, 'name'),
            industry: formString(form, 'industry'),
            companySize: formString(form, 'companySize'),
            country: formString(form, 'country'),
            timezone: formString(form, 'timezone'),
            currency: formString(form, 'currency'),
          });
        }}
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Organisation setup
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Set up your first workspace.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            A few business details help mikyasOS prepare the right operating context.
          </p>
        </div>
        <TextField label="Business name" name="name" required />
        <label className="grid gap-2 text-sm font-medium">
          Industry
          <select
            name="industry"
            className="h-10 rounded-md border border-input bg-background px-3"
          >
            {industries.map((industry) => (
              <option key={industry}>{industry}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Company size
          <select
            name="companySize"
            className="h-10 rounded-md border border-input bg-background px-3"
          >
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Country" name="country" defaultValue="United States" />
          <TextField label="Timezone" name="timezone" defaultValue="America/New_York" />
          <TextField label="Currency" name="currency" defaultValue="USD" />
        </div>
        {mutation.error ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating workspace...' : 'Continue to workspace'}
        </Button>
      </form>
    </main>
  );
}
