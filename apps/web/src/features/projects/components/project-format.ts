import type { Project, Task } from '@/api/client';

export function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatMoney(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '£0';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatHours(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '0h';
  return `${Number(value).toLocaleString()}h`;
}

export function initials(value?: string | null) {
  return (value ?? 'PR')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function projectHealth(project: Project, tasks: Task[] = []) {
  const dueDate = project.dueDate ? new Date(project.dueDate) : null;
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE',
  );
  if (project.status === 'ARCHIVED') return 'Archived';
  if (project.status === 'COMPLETED') return 'Complete';
  if (overdueTasks.length || (dueDate && dueDate < new Date())) return 'At risk';
  if (project.progress >= 70) return 'Healthy';
  return 'Watch';
}
