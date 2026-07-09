import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { isJwtExpired, useAuthStore } from '@/stores/auth-store';

export function ProtectedRoute() {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const expired = isJwtExpired(accessToken);

  useEffect(() => {
    if (expired) {
      clearAuth();
    }
  }, [clearAuth, expired]);

  if (!accessToken || expired) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
