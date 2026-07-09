import { ChevronRight, Columns3, Grid2X2, List, PanelRight, Search, Upload } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import type { DocumentFolder, KnowledgeDocument } from '@/api/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DocumentCard, FolderCard } from './document-cards';
import { DocumentTable } from './document-table';
import { DocumentReveal } from './document-motion';

export type DocumentViewMode = 'grid' | 'list' | 'compact';

export function DocumentSearchBar({
  value,
  onChange,
  placeholder = 'Search company knowledge...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="premium-focus flex h-10 min-w-0 items-center gap-2 rounded-md border bg-background px-3 text-sm">
      <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      <input
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function DocumentFilters({
  type,
  visibility,
  onTypeChange,
  onVisibilityChange,
}: {
  type: string;
  visibility: string;
  onTypeChange: (value: string) => void;
  onVisibilityChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="h-10 rounded-md border bg-background px-3 text-sm"
        value={type}
        onChange={(event) => onTypeChange(event.target.value)}
      >
        <option value="">All file types</option>
        <option value="PDF">PDF</option>
        <option value="DOCX">DOCX</option>
        <option value="XLSX">XLSX</option>
        <option value="CSV">CSV</option>
        <option value="IMAGE">Images</option>
        <option value="MARKDOWN">Markdown</option>
      </select>
      <select
        className="h-10 rounded-md border bg-background px-3 text-sm"
        value={visibility}
        onChange={(event) => onVisibilityChange(event.target.value)}
      >
        <option value="">All visibility</option>
        <option value="ORGANISATION">Organisation</option>
        <option value="PRIVATE">Private</option>
        <option value="RESTRICTED">Restricted</option>
      </select>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; to: string }> }) {
  return (
    <nav
      className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <span key={item.to} className="flex items-center gap-1">
          {index > 0 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
          <Link className="hover:text-foreground" to={item.to}>
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export function FolderTree({ folders }: { folders: DocumentFolder[] }) {
  return (
    <aside className="document-glass-panel p-4">
      <h3 className="font-semibold">Folder tree</h3>
      <div className="mt-4 grid gap-2">
        <Link className="rounded-md px-3 py-2 text-sm hover:bg-muted" to="/app/documents/folders">
          All folders
        </Link>
        {folders.map((folder) => (
          <Link
            key={folder.id}
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
            to={`/app/documents/folders/${folder.id}`}
          >
            {folder.name}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Nested folders, move actions, and permissions are prepared.
      </p>
    </aside>
  );
}

export function UploadDropzone({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <button
      className="document-drop-zone document-glass-panel w-full border-dashed p-6 text-left"
      onClick={onUploadClick}
      onDragOver={(event) => event.preventDefault()}
    >
      <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 font-semibold">Drop files into the knowledge hub</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Drag and drop upload, progress, retry, validation, folder choice, tags, and linked records
        are prepared.
      </p>
    </button>
  );
}

export function UploadQueue() {
  return (
    <div className="document-glass-panel p-4">
      <h3 className="font-semibold">Upload queue</h3>
      <div className="mt-4 grid gap-3">
        {['Validation', 'Upload progress', 'Success and retry states'].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
          >
            <span>{item}</span>
            <span className="text-xs text-muted-foreground">Prepared</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentFileManager({
  documents,
  folders,
  viewMode,
  onViewModeChange,
  selectedIds,
  onToggleMetadata,
  children,
}: {
  documents: KnowledgeDocument[];
  folders: DocumentFolder[];
  viewMode: DocumentViewMode;
  onViewModeChange: (mode: DocumentViewMode) => void;
  selectedIds: string[];
  onToggleMetadata: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <div className="document-glass-panel flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedIds.length
            ? `${selectedIds.length} selected · bulk actions prepared`
            : 'Multi-select and keyboard navigation prepared'}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['grid', 'list', 'compact'] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange(mode)}
            >
              {mode === 'grid' ? (
                <Grid2X2 className="mr-2 size-4" />
              ) : mode === 'list' ? (
                <List className="mr-2 size-4" />
              ) : (
                <Columns3 className="mr-2 size-4" />
              )}
              {mode}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={onToggleMetadata}>
            <PanelRight className="mr-2 size-4" />
            Metadata
          </Button>
        </div>
      </div>
      {children}
      {folders.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder, index) => (
            <DocumentReveal key={folder.id} delay={index * 0.03}>
              <FolderCard folder={folder} />
            </DocumentReveal>
          ))}
        </div>
      ) : null}
      {viewMode === 'list' ? (
        <DocumentTable documents={documents} />
      ) : (
        <div
          className={cn(
            'grid gap-3',
            viewMode === 'compact' ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-4',
          )}
        >
          {documents.map((document, index) => (
            <DocumentReveal key={document.id} delay={index * 0.025}>
              <DocumentCard document={document} />
            </DocumentReveal>
          ))}
        </div>
      )}
    </div>
  );
}
