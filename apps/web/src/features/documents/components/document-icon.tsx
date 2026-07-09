import {
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  NotebookText,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export function DocumentIcon({ type, className }: { type?: string; className?: string }) {
  const Icon =
    type === 'IMAGE'
      ? FileImage
      : type === 'PDF'
        ? FileType
        : type === 'XLSX' || type === 'CSV'
          ? FileSpreadsheet
          : type === 'TEXT' || type === 'MARKDOWN'
            ? NotebookText
            : type === 'DOCX'
              ? FileText
              : FileArchive;

  return (
    <span className={cn('grid size-10 place-items-center rounded-md bg-muted', className)}>
      <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}
