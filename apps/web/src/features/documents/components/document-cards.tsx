import { Folder, Lock, MoreHorizontal, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import type { DocumentFolder, KnowledgeDocument } from '@/api/client';
import { Button } from '@/components/ui/button';
import { AiReadinessIndicator } from './ai-readiness-indicator';
import { documentTypeLabel, formatDocumentDate, formatFileSize } from './document-format';
import { DocumentIcon } from './document-icon';
import { DocumentHoverCard } from './document-motion';

export function DocumentTags({ document }: { document: KnowledgeDocument }) {
  const tags = document.tags?.map(({ tag }) => tag) ?? [];
  if (!tags.length) return <span className="text-xs text-muted-foreground">No tags</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag.id}
          className="rounded-md border px-2 py-1 text-xs"
          style={{ borderColor: tag.colour }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}

export function DocumentCard({ document }: { document: KnowledgeDocument }) {
  return (
    <Link className="group block" to={`/app/documents/${document.id}`}>
      <DocumentHoverCard className="document-card-premium premium-card p-4">
        <div className="flex items-start justify-between gap-3">
          <DocumentIcon type={document.documentType} />
          <div className="flex items-center gap-2 text-muted-foreground">
            {document.isLocked ? <Lock className="size-4" aria-label="Locked" /> : null}
            <ShieldCheck className="size-4" aria-label="Permission indicator" />
            <AiReadinessIndicator state="queued" compact />
          </div>
        </div>
        <div className="mt-4 rounded-md border bg-muted/30 p-3 opacity-85 transition group-hover:opacity-100">
          <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
          <p className="mt-2 text-xs text-muted-foreground">Preview and AI readiness prepared</p>
        </div>
        <h3 className="mt-4 line-clamp-2 font-semibold">{document.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {documentTypeLabel(document)} · {formatFileSize(document.fileSize)}
        </p>
        <div className="mt-4">
          <DocumentTags document={document} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{document.owner?.name ?? 'Unknown owner'}</span>
          <span>{formatDocumentDate(document.updatedAt)}</span>
        </div>
      </DocumentHoverCard>
    </Link>
  );
}

export function FolderCard({ folder }: { folder: DocumentFolder }) {
  return (
    <Link
      className="document-card-premium premium-card flex items-center justify-between gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
      to={`/app/documents/folders/${folder.id}`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-muted">
          <Folder className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold">{folder.name}</h3>
          <p className="text-xs text-muted-foreground">
            {folder._count?.documents ?? 0} documents · {folder.visibility ?? 'ORGANISATION'}
          </p>
        </div>
      </div>
      <Button size="icon" variant="ghost" aria-label={`Folder actions for ${folder.name}`}>
        <MoreHorizontal className="size-4" />
      </Button>
    </Link>
  );
}
