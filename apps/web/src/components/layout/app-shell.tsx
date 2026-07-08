import { motion } from 'framer-motion';
import { Activity, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/theme-store';

export function AppShell() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">mikyasOS</p>
              <p className="mt-1 text-xs text-muted-foreground">Business operating system</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-3xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Foundation ready
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Build the business OS on a clean, scalable shell.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            The application frame is wired with routing, async state, local state, animation, theme
            support, and shared package boundaries. Feature surfaces can now be added without
            reshaping the foundation.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
