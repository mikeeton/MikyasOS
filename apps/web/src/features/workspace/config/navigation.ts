import {
  AreaChart,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Gauge,
  Settings,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type NavigationItem = {
  title: string;
  route: string;
  icon: LucideIcon;
  permission?: string;
  badge?: string;
  featureFlag?: string;
  keywords: string[];
  disabled?: boolean;
};

export const workspaceNavigation: NavigationItem[] = [
  {
    title: 'Dashboard',
    route: '/app',
    icon: Gauge,
    keywords: ['home', 'overview', 'workspace'],
  },
  {
    title: 'CRM',
    route: '/app/crm',
    icon: UsersRound,
    permission: 'crm.read',
    featureFlag: 'crm',
    keywords: ['customers', 'contacts', 'sales'],
  },
  {
    title: 'Projects',
    route: '/app/projects',
    icon: BriefcaseBusiness,
    permission: 'projects.read',
    featureFlag: 'projects',
    keywords: ['delivery', 'work', 'client projects'],
  },
  {
    title: 'Tasks',
    route: '/app/projects/list',
    icon: Target,
    permission: 'tasks.read',
    featureFlag: 'tasks',
    keywords: ['todos', 'work queue', 'actions'],
  },
  {
    title: 'Documents',
    route: '/app/documents',
    icon: FileText,
    permission: 'documents.read',
    featureFlag: 'documents',
    keywords: ['files', 'knowledge', 'notes'],
    disabled: true,
  },
  {
    title: 'Calendar',
    route: '/app/calendar',
    icon: CalendarDays,
    permission: 'calendar.read',
    featureFlag: 'calendar',
    keywords: ['schedule', 'events', 'meetings'],
    disabled: true,
  },
  {
    title: 'Finance',
    route: '/app/finance',
    icon: CircleDollarSign,
    permission: 'finance.read',
    featureFlag: 'finance',
    keywords: ['invoices', 'billing', 'payments'],
    disabled: true,
  },
  {
    title: 'Analytics',
    route: '/app/analytics',
    icon: AreaChart,
    permission: 'analytics.read',
    featureFlag: 'analytics',
    keywords: ['reports', 'metrics', 'insights'],
    disabled: true,
  },
  {
    title: 'Automation',
    route: '/app/automation',
    icon: Workflow,
    permission: 'automation.read',
    featureFlag: 'automation',
    keywords: ['workflows', 'rules', 'integrations'],
    disabled: true,
  },
  {
    title: 'AI',
    route: '/app/ai',
    icon: Bot,
    permission: 'ai.read',
    featureFlag: 'ai',
    badge: 'Soon',
    keywords: ['assistant', 'memory', 'briefing'],
    disabled: true,
  },
  {
    title: 'Settings',
    route: '/app/settings',
    icon: Settings,
    permission: 'settings.read',
    keywords: ['workspace', 'preferences', 'account'],
  },
];

export const quickActions: NavigationItem[] = [
  {
    title: 'Create company',
    route: '/app/crm/companies/new',
    icon: UsersRound,
    keywords: ['crm', 'customer', 'account'],
  },
  {
    title: 'Search CRM',
    route: '/app/crm/search',
    icon: Sparkles,
    keywords: ['crm', 'customers', 'find'],
  },
  {
    title: 'Create project',
    route: '/app/projects/new',
    icon: BriefcaseBusiness,
    keywords: ['projects', 'delivery', 'work'],
  },
  {
    title: 'Project portfolio',
    route: '/app/projects/list',
    icon: Target,
    keywords: ['projects', 'tasks', 'portfolio'],
  },
  {
    title: 'Create organisation',
    route: '/organisations/new',
    icon: Sparkles,
    keywords: ['workspace', 'company', 'business'],
  },
  {
    title: 'Open settings',
    route: '/app/settings',
    icon: Settings,
    keywords: ['preferences', 'organisation', 'account'],
  },
];

export const recentPages = workspaceNavigation.slice(0, 4);
