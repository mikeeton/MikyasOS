import { AuthLayout } from './auth-layout';

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Password recovery UI is reserved for the email delivery milestone. The identity foundation
        is ready for the reset flow.
      </p>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Entering a reset token will be enabled when outbound email is connected.
      </p>
    </AuthLayout>
  );
}
