import { Download, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

import type { KnowledgeDocument } from '@/api/client';
import { Button } from '@/components/ui/button';
import { documentTypeLabel, formatDocumentDate, formatFileSize } from './document-format';
import { DocumentIcon } from './document-icon';
import { DocumentTags } from './document-cards';

export function DocumentTable({ documents }: { documents: KnowledgeDocument[] }) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <div className="hidden grid-cols-[minmax(220px,1.4fr)_120px_160px_180px_120px_140px_90px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground lg:grid">
        <span>Name</span>
        <span>Type</span>
        <span>Owner</span>
        <span>Tags</span>
        <span>Size</span>
        <span>Updated</span>
        <span>Actions</span>
      </div>
      <div className="divide-y">
        {documents.map((document) => (
          <div
            key={document.id}
            className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(220px,1.4fr)_120px_160px_180px_120px_140px_90px] lg:items-center"
          >
            <Link
              className="flex items-center gap-3 font-medium"
              to={`/app/documents/${document.id}`}
            >
              <DocumentIcon type={document.documentType} className="size-9" />
              <span className="line-clamp-1">{document.title}</span>
            </Link>
            <span className="text-sm text-muted-foreground">{documentTypeLabel(document)}</span>
            <span className="text-sm text-muted-foreground">
              {document.owner?.name ?? 'Unknown'}
            </span>
            <DocumentTags document={document} />
            <span className="text-sm text-muted-foreground">
              {formatFileSize(document.fileSize)}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDocumentDate(document.updatedAt)}
            </span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label={`Download ${document.title}`}>
                <Download className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label={`Actions for ${document.title}`}>
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
