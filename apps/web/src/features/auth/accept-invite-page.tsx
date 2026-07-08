import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';

import { identityApi } from '@/api/client';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { formString } from '@/lib/form-data';
import { useAuthStore } from '@/stores/auth-store';
import { AuthLayout } from './auth-layout';

export function AcceptInvitePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const mutation = useMutation({
    mutationFn: identityApi.acceptInvitation,
    onSuccess: (response) => {
      setAuth(response);
      void navigate('/app');
    },
  });

  return (
    <AuthLayout>
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          mutation.mutate({
            token: formString(form, 'token'),
            name: formString(form, 'name'),
            password: formString(form, 'password'),
          });
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accept invitation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the organisation you were invited to.
          </p>
        </div>
        <TextField
          label="Invitation token"
          name="token"
          defaultValue={params.get('token') ?? ''}
          required
        />
        <TextField label="Name for new accounts" name="name" />
        <TextField
          label="Password for new accounts"
          name="password"
          type="password"
          minLength={12}
        />
        {mutation.error ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Accepting...' : 'Accept invitation'}
        </Button>
      </form>
    </AuthLayout>
  );
}
