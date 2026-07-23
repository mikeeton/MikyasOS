import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('premium-shimmer rounded-md', className)} {...props} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-4" aria-label="Loading dashboard">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="premium-section p-4">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="mt-4 h-7 w-20 rounded-full" />
          <Skeleton className="mt-4 h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
