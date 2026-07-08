import { useMutation } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router';

import { identityApi } from '@/api/client';
import { TextField } from '@/components/forms/text-field';
import { Button } from '@/components/ui/button';
import { formString } from '@/lib/form-data';
import { useAuthStore } from '@/stores/auth-store';
import { AuthLayout } from './auth-layout';

export function RegisterPage() {
  const navigate = useNavigate();
  const { accessToken, user, setAuth } = useAuthStore();
  const mutation = useMutation({
    mutationFn: identityApi.register,
    onSuccess: (response) => {
      setAuth(response);
      void navigate('/onboarding');
    },
  });

  if (accessToken) {
    return <Navigate to={user?.activeOrganisationId ? '/app' : '/onboarding'} replace />;
  }

  return (
    <AuthLayout>
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          mutation.mutate({
            name: formString(form, 'name'),
            email: formString(form, 'email'),
            password: formString(form, 'password'),
          });
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start with your identity. The organisation comes next.
          </p>
        </div>
        <TextField label="Full name" name="name" autoComplete="name" required />
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField
          label="Password"
          name="password"
          type="password"
          minLength={12}
          autoComplete="new-password"
          required
        />
        {mutation.error ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
