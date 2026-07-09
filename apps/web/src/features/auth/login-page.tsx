import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

import { identityApi } from '@/api/client';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/forms/text-field';
import { formString } from '@/lib/form-data';
import { isJwtExpired, useAuthStore } from '@/stores/auth-store';
import { AuthLayout } from './auth-layout';

export function LoginPage() {
  const navigate = useNavigate();
  const { accessToken, user, setAuth, clearAuth } = useAuthStore();
  const mutation = useMutation({
    mutationFn: identityApi.login,
    onSuccess: (response) => {
      setAuth(response);
      void navigate(response.user.activeOrganisationId ? '/app' : '/onboarding');
    },
  });

  useEffect(() => {
    if (isJwtExpired(accessToken)) {
      clearAuth();
    }
  }, [accessToken, clearAuth]);

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
            email: formString(form, 'email'),
            password: formString(form, 'password'),
          });
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to your mikyasOS workspace.</p>
        </div>
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {mutation.error ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Log in'}
        </Button>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
