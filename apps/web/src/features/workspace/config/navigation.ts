import {
  AreaChart,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Gauge,
  MessageSquareText,
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
    route: '/app/tasks',
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
  },
  {
    title: 'Chat',
    route: '/app/chat',
    icon: MessageSquareText,
    permission: 'Communication.Read',
    featureFlag: 'communication',
    badge: 'New',
    keywords: ['chat', 'messages', 'meetings', 'announcements'],
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
    permission: 'Finance.Read',
    featureFlag: 'finance',
    badge: 'New',
    keywords: ['invoices', 'billing', 'payments'],
  },
  {
    title: 'Analytics',
    route: '/app/analytics',
    icon: AreaChart,
    permission: 'Analytics.Read',
    featureFlag: 'analytics',
    badge: 'New',
    keywords: ['reports', 'metrics', 'insights'],
  },
  {
    title: 'Automation',
    route: '/app/automation',
    icon: Workflow,
    permission: 'Automation.Read',
    featureFlag: 'automation',
    badge: 'New',
    keywords: ['workflows', 'rules', 'integrations'],
  },
  {
    title: 'AI',
    route: '/app/ai',
    icon: Bot,
    permission: 'AI.Read',
    featureFlag: 'ai',
    badge: 'Ready',
    keywords: ['assistant', 'memory', 'briefing'],
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
    title: 'Search documents',
    route: '/app/documents/search',
    icon: FileText,
    keywords: ['documents', 'knowledge', 'files'],
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
