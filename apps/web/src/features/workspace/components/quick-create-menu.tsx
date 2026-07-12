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
        className="bg-background/72 backdrop-blur"
        aria-label="Quick create"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Plus className="size-4" aria-hidden="true" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={premiumSpring}
            className="premium-glass absolute right-0 z-40 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-md p-2"
          >
            <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick create
            </p>
            <div className="grid gap-1">
              {quickCreateItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="premium-interactive flex items-center gap-3 rounded-md px-3 py-3 hover:bg-accent"
                  >
                    <span className="grid size-9 place-items-center rounded-md bg-secondary">
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
