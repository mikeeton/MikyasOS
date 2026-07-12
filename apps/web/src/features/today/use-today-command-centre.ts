import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  communicationApi,
  financeApi,
  projectsApi,
  type Invoice,
  type Meeting,
  type Project,
  type Task,
} from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';

export type TodayAction = {
  id: string;
  title: string;
  detail: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
  source: 'meeting' | 'task' | 'invoice' | 'project' | 'ai';
};

export type TodayNotification = {
  id: string;
  group: 'Calendar' | 'Projects' | 'Finance' | 'Automation' | 'Communication';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  route: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(value: string | null | undefined, date = new Date()) {
  if (!value) return false;
  return startOfDay(new Date(value)).getTime() === startOfDay(date).getTime();
}

function isWithinHours(value: string | null | undefined, hours: number) {
  if (!value) return false;
  const now = Date.now();
  const time = new Date(value).getTime();
  return time >= now && time <= now + hours * 60 * 60 * 1000;
}

function isPastDay(value: string | null | undefined) {
  if (!value) return false;
  return startOfDay(new Date(value)).getTime() < startOfDay(new Date()).getTime();
}

function isOpenStatus(status?: string | null) {
  return !['DONE', 'COMPLETED', 'PAID', 'CLOSED', 'CANCELLED', 'ARCHIVED'].includes(
    String(status ?? '').toUpperCase(),
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
    new Date(value),
  );
}

function formatMoney(value: string | number | null | undefined, currency = 'USD') {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function items<T>(data?: { items: T[] }): T[] {
  return data?.items ?? [];
}

export function useTodayCommandCentre() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  const organisationId = currentOrganisation?.id ?? null;
  const enabled = Boolean(token && organisationId);

  const meetings = useQuery({
    queryKey: ['today', 'meetings', organisationId],
    queryFn: () => communicationApi.meetings(token!, organisationId!, { pageSize: 100 }),
    enabled,
    staleTime: 30_000,
  });

  const tasks = useQuery({
    queryKey: ['today', 'tasks', organisationId],
    queryFn: () => projectsApi.tasks(token!, organisationId!, { pageSize: 100 }),
    enabled,
    staleTime: 30_000,
  });

  const projects = useQuery({
    queryKey: ['today', 'projects', organisationId],
    queryFn: () => projectsApi.projects(token!, organisationId!, { pageSize: 100 }),
    enabled,
    staleTime: 30_000,
  });

  const invoices = useQuery({
    queryKey: ['today', 'invoices', organisationId],
    queryFn: () => financeApi.invoices(token!, organisationId!, { pageSize: 100 }),
    enabled,
    staleTime: 30_000,
  });

  return useMemo(() => {
    const meetingItems = items<Meeting>(meetings.data);
    const taskItems = items<Task>(tasks.data);
    const projectItems = items<Project>(projects.data);
    const invoiceItems = items<Invoice>(invoices.data);

    const todaysMeetings = meetingItems
      .filter((meeting) => isSameDay(meeting.startsAt))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    const dueTasks = taskItems
      .filter((task) => isSameDay(task.dueDate) && isOpenStatus(task.status))
      .sort((a, b) => String(a.priority).localeCompare(String(b.priority)));

    const overdueInvoices = invoiceItems
      .filter((invoice) => isPastDay(invoice.dueDate) && isOpenStatus(invoice.status))
      .sort((a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime());

    const blockedProjects = projectItems.filter((project) =>
      ['BLOCKED', 'AT_RISK', 'ON_HOLD'].includes(String(project.status).toUpperCase()),
    );

    const suggestedActions: TodayAction[] = [
      ...todaysMeetings.slice(0, 3).map((meeting) => ({
        id: `meeting-${meeting.id}`,
        title: `Prepare for ${meeting.title}`,
        detail: `Starts at ${formatTime(meeting.startsAt)}. Review agenda, notes, CRM, and linked project context.`,
        route: `/app/meetings/${meeting.id}`,
        priority: 'medium' as const,
        source: 'meeting' as const,
      })),
      ...dueTasks.slice(0, 4).map((task) => ({
        id: `task-${task.id}`,
        title: `Finish ${task.title}`,
        detail: `${task.priority} priority in ${task.project?.name ?? 'Projects'}.`,
        route: `/app/tasks/${task.id}`,
        priority:
          String(task.priority).toUpperCase() === 'HIGH' ? ('high' as const) : ('medium' as const),
        source: 'task' as const,
      })),
      ...overdueInvoices.slice(0, 3).map((invoice) => ({
        id: `invoice-${invoice.id}`,
        title: `Follow up ${invoice.invoiceNumber}`,
        detail: `${formatMoney(invoice.balance ?? invoice.total, invoice.currency)} overdue.`,
        route: '/app/invoices',
        priority: 'high' as const,
        source: 'invoice' as const,
      })),
      ...blockedProjects.slice(0, 3).map((project) => ({
        id: `project-${project.id}`,
        title: `Unblock ${project.name}`,
        detail: `${project.status} project with ${project._count?.tasks ?? 0} tasks.`,
        route: `/app/projects/${project.id}`,
        priority: 'high' as const,
        source: 'project' as const,
      })),
    ].slice(0, 10);

    const notifications: TodayNotification[] = [
      ...meetingItems
        .filter((meeting) => isWithinHours(meeting.startsAt, 2))
        .map((meeting) => ({
          id: `meeting-starting-${meeting.id}`,
          group: 'Calendar' as const,
          title: 'Meeting starting soon',
          description: `${meeting.title} starts at ${formatTime(meeting.startsAt)}.`,
          timestamp: 'Soon',
          unread: true,
          route: `/app/meetings/${meeting.id}`,
        })),
      ...taskItems
        .filter((task) => isWithinHours(task.dueDate, 24) && isOpenStatus(task.status))
        .map((task) => ({
          id: `task-due-${task.id}`,
          group: 'Projects' as const,
          title: 'Task due soon',
          description: `${task.title} is due today in ${task.project?.name ?? 'Projects'}.`,
          timestamp: 'Today',
          unread: true,
          route: `/app/tasks/${task.id}`,
        })),
      ...invoiceItems
        .filter((invoice) => isPastDay(invoice.dueDate) && isOpenStatus(invoice.status))
        .map((invoice) => ({
          id: `invoice-overdue-${invoice.id}`,
          group: 'Finance' as const,
          title: 'Invoice overdue',
          description: `${invoice.invoiceNumber} has ${formatMoney(invoice.balance ?? invoice.total, invoice.currency)} outstanding.`,
          timestamp: 'Overdue',
          unread: true,
          route: '/app/invoices',
        })),
      ...blockedProjects.map((project) => ({
        id: `project-blocked-${project.id}`,
        group: 'Projects' as const,
        title: 'Project needs attention',
        description: `${project.name} is marked ${project.status}.`,
        timestamp: 'Now',
        unread: true,
        route: `/app/projects/${project.id}`,
      })),
    ].slice(0, 20);

    return {
      todaysMeetings,
      dueTasks,
      overdueInvoices,
      blockedProjects,
      suggestedActions,
      notifications,
      isLoading: meetings.isLoading || tasks.isLoading || projects.isLoading || invoices.isLoading,
      isError: meetings.isError || tasks.isError || projects.isError || invoices.isError,
      refetch: () => {
        void meetings.refetch();
        void tasks.refetch();
        void projects.refetch();
        void invoices.refetch();
      },
    };
  }, [invoices, meetings, projects, tasks]);
}
