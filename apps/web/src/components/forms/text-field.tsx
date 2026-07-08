import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <input
        className={cn(
          'h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20',
          className,
        )}
        {...props}
      />
    </label>
  );
}
