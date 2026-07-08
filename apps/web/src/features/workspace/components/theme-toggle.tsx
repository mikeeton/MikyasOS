import { Laptop, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useWorkspace } from '../hooks/use-workspace';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useWorkspace();

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/40 p-1">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              className={cn(
                'inline-flex h-8 items-center justify-center gap-2 rounded px-2 text-xs transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                theme === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setTheme(option.value)}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const current = themeOptions.find((option) => option.value === theme) ?? themeOptions[2];
  const Icon = current.icon;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Theme: ${current.label}`}
      onClick={() => {
        const currentIndex = themeOptions.findIndex((option) => option.value === theme);
        const nextOption =
          themeOptions[(currentIndex + 1) % themeOptions.length] ?? themeOptions[0];
        setTheme(nextOption.value);
      }}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
