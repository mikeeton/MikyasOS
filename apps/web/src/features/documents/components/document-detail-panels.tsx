import {
  Download,
  Eye,
  Link2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

import type {
  DocumentActivity,
  DocumentLink,
  DocumentVersion,
  KnowledgeDocument,
} from '@/api/client';
import { Button } from '@/components/ui/button';
import { AiReadinessIndicator } from './ai-readiness-indicator';
import { documentTypeLabel, formatDocumentDate, formatFileSize } from './document-format';
import { DocumentIcon } from './document-icon';
import { DocumentTags } from './document-cards';
import { DocumentReveal, KnowledgePanelMotion } from './document-motion';

export function DocumentPreview({ document }: { document?: KnowledgeDocument }) {
  if (!document) return null;
  const type = document.documentType;
  const supported = ['PDF', 'IMAGE', 'TEXT', 'MARKDOWN', 'CSV'].includes(type);
  return (
    <DocumentReveal>
      <section className="document-reader-focus document-glass-panel min-h-[320px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">Focused reading space prepared</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Download
          </Button>
        </div>
        <div className="document-ai-scan mt-5 grid min-h-[240px] place-items-center rounded-md border bg-muted/30 p-6 text-center">
          <div>
            <DocumentIcon type={type} className="mx-auto size-14" />
            <h4 className="mt-4 font-semibold">
              {supported
                ? `${documentTypeLabel(document)} preview architecture`
                : 'Preview unavailable'}
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {supported
                ? 'The UI is ready for PDF, image, text, markdown, and CSV previews. Real file streaming arrives with storage delivery.'
                : 'DOCX, XLSX, video, audio, OCR, and generated thumbnails are prepared for future preview services.'}
            </p>
          </div>
        </div>
      </section>
    </DocumentReveal>
  );
}

export function DocumentMetadataPanel({ document }: { document?: KnowledgeDocument }) {
  if (!document) return null;
  return (
    <KnowledgePanelMotion className="document-glass-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Knowledge sidebar</h3>
        <AiReadinessIndicator state="queued" compact />
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        {[
          ['Title', document.title],
          ['Type', documentTypeLabel(document)],
          ['Size', formatFileSize(document.fileSize)],
          ['Owner', document.owner?.name ?? 'Unknown'],
          ['Folder', document.folder?.name ?? 'Root'],
          ['Visibility', document.visibility],
          [
            'Version',
            document.currentVersion?.versionNumber
              ? `v${document.currentVersion.versionNumber}`
              : 'v1',
          ],
          ['Created', formatDocumentDate(document.createdAt)],
          ['Updated', formatDocumentDate(document.updatedAt)],
          ['Checksum', document.checksum ? 'Stored' : 'Prepared'],
        ].map(([label, value], index) => (
          <DocumentReveal key={label} delay={index * 0.025}>
            <div className="flex justify-between gap-4 border-b pb-2 last:border-b-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          </DocumentReveal>
        ))}
      </dl>
      <div className="mt-5">
        <DocumentTags document={document} />
      </div>
    </KnowledgePanelMotion>
  );
}

export function DocumentVersionList({
  versions,
  currentVersionId,
}: {
  versions: DocumentVersion[];
  currentVersionId?: string | null;
}) {
  return (
    <div className="document-glass-panel p-5">
      <h3 className="font-semibold">Version history</h3>
      <div className="mt-4 grid gap-3">
        {versions.map((version, index) => (
          <DocumentReveal key={version.id} delay={index * 0.035}>
            <div className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">
                  Version {version.versionNumber}{' '}
                  {version.id === currentVersionId ? (
                    <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Current
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {version.uploadedBy?.name ?? 'Unknown'} · {formatDocumentDate(version.createdAt)}{' '}
                  · {formatFileSize(version.fileSize)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {version.changeNote ?? 'No change note'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  <RotateCcw className="mr-2 size-4" />
                  Restore placeholder
                </Button>
              </div>
            </div>
          </DocumentReveal>
        ))}
      </div>
    </div>
  );
}

export function DocumentPermissionPanel({ document }: { document?: KnowledgeDocument }) {
  return (
    <div className="document-glass-panel p-5">
      <h3 className="font-semibold">Permissions</h3>
      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between rounded-md border p-3">
          <span className="flex items-center gap-2 text-sm">
            <UserRound className="size-4" />
            {document?.owner?.name ?? 'Owner'}
          </span>
          <span className="rounded-md bg-muted px-2 py-1 text-xs">Owner</span>
        </div>
        {[
          'Organisation role access',
          'Inherited folder permissions',
          'Teams with access',
          'Future external sharing',
        ].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-md border p-3 text-sm"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              {item}
            </span>
            <select
              className="rounded-md border bg-background px-2 py-1 text-xs"
              defaultValue="VIEW"
            >
              <option>VIEW</option>
              <option>COMMENT</option>
              <option>EDIT</option>
              <option>MANAGE</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentActivityTimeline({ activities }: { activities: DocumentActivity[] }) {
  return (
    <div className="document-glass-panel p-5">
      <h3 className="font-semibold">Activity timeline</h3>
      <div className="mt-4 grid gap-4">
        {activities.map((activity, index) => (
          <DocumentReveal key={activity.id} delay={index * 0.03}>
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <span className="mt-1 size-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">
                  {activity.action.replaceAll('_', ' ').toLowerCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.actor?.name ?? 'System'} · {formatDocumentDate(activity.createdAt)}
                </p>
              </div>
            </div>
          </DocumentReveal>
        ))}
        {!activities.length ? (
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
        ) : null}
      </div>
    </div>
  );
}

export function LinkedRecordCard({ link }: { link: DocumentLink }) {
  return (
    <div className="document-card-premium premium-card p-4">
      <Link2 className="size-5 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{link.entityType}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{link.entityId}</p>
    </div>
  );
}

export function CollaborationPlaceholder() {
  return (
    <div className="document-glass-panel border-dashed p-5">
      <Eye className="size-5 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">Collaboration prepared</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Presence, comments, mentions, watchers, and live editing are represented as future-ready UI
        placeholders.
      </p>
    </div>
  );
}

export function AiDocumentPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[
        'AI Summary',
        'Ask this document',
        'Related documents',
        'Suggested tags',
        'Extracted key points',
        'Knowledge readiness score',
      ].map((title) => (
        <div key={title} className="document-ai-scan document-glass-panel border-dashed p-4">
          <Sparkles className="size-4 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">{title}</h3>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full bg-foreground/20" />
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Coming soon. No AI execution is connected.
          </p>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeGraphPlaceholder() {
  const nodes = ['Document', 'Company', 'Project', 'Task', 'Related docs', 'AI memory'];

  return (
    <div className="document-knowledge-graph document-glass-panel p-5">
      <h3 className="font-semibold">Knowledge graph placeholder</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Future relationships across CRM, projects, tasks, related documents, and AI memory.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {nodes.map((node, index) => (
          <DocumentReveal key={node} delay={index * 0.04}>
            <div className="rounded-md border bg-background/80 p-3 text-sm font-medium shadow-sm">
              {node}
            </div>
          </DocumentReveal>
        ))}
      </div>
    </div>
  );
}

export function PermissionIndicator({ locked }: { locked?: boolean }) {
  return locked ? (
    <Lock className="size-4 text-muted-foreground" />
  ) : (
    <ShieldCheck className="size-4 text-muted-foreground" />
  );
}
