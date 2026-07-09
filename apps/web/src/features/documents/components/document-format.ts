import type { KnowledgeDocument } from '@/api/client';

export function formatFileSize(bytes?: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatDocumentDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function documentTypeLabel(
  document: Pick<KnowledgeDocument, 'documentType' | 'fileExtension'>,
) {
  return document.documentType === 'OTHER'
    ? document.fileExtension.toUpperCase()
    : document.documentType;
}

export function normalisePaginatedItems<T>(value?: { items?: T[] } | null) {
  return value?.items ?? [];
}
