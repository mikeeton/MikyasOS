import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  Plus,
  Receipt,
  Target,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

import { premiumSpring } from '../motion/premium-motion';

const quickCreateItems = [
  {
    label: 'Company',
    description: 'Create a CRM account',
    to: '/app/crm/companies/new',
    icon: Building2,
  },
  {
    label: 'Contact',
    description: 'Add a person',
    to: '/app/crm/contacts/new',
    icon: UserRound,
  },
  {
    label: 'Project',
    description: 'Start delivery work',
    to: '/app/projects/new',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Task',
    description: 'Open task workspace',
    to: '/app/tasks',
    icon: Target,
  },
  {
    label: 'Meeting',
    description: 'Schedule from calendar',
    to: '/app/calendar',
    icon: CalendarDays,
  },
  {
    label: 'Document',
    description: 'Open knowledge hub',
    to: '/app/documents',
    icon: FileText,
  },
  {
    label: 'Invoice',
    description: 'Open billing records',
    to: '/app/invoices',
    icon: Receipt,
  },
] as const;

export function QuickCreateMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="group relative bg-background/72 backdrop-blur"
        aria-label="Quick create"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Plus className="size-4" aria-hidden="true" />
        <span
          className="pointer-events-none absolute inset-0 rounded-md bg-primary/5 opacity-0 transition group-hover:opacity-100"
          aria-hidden="true"
        />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={premiumSpring}
            className="premium-glass absolute right-0 z-40 mt-3 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-md p-2 shadow-2xl"
          >
            <div className="mb-1 rounded-md border bg-background/60 px-3 py-3">
              <p className="text-sm font-semibold">Quick create</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start common work without leaving the workspace.
              </p>
            </div>
            <div className="grid gap-1">
              {quickCreateItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="premium-list-link flex items-center gap-3 px-3 py-3"
                  >
                    <span className="grid size-9 place-items-center rounded-md border bg-secondary/70">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
