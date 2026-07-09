import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Archive, FilePlus2, FolderPlus, NotebookPen, Search, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/forms/text-field';
import {
  AiKnowledgePlaceholder,
  DocumentErrorState,
  DocumentShell,
  DocumentSkeleton,
  EmptyKnowledgeState,
  KnowledgeStatsCard,
  QuickActionCard,
} from '../components/document-shell';
import { FolderCard } from '../components/document-cards';
import {
  DocumentFileManager,
  DocumentFilters,
  DocumentSearchBar,
  FolderTree,
  UploadDropzone,
  UploadQueue,
  type DocumentViewMode,
} from '../components/document-file-manager';
import {
  AiDocumentPanel,
  CollaborationPlaceholder,
  DocumentActivityTimeline,
  DocumentMetadataPanel,
  DocumentPermissionPanel,
  DocumentPreview,
  DocumentVersionList,
  KnowledgeGraphPlaceholder,
  LinkedRecordCard,
} from '../components/document-detail-panels';
import { formatFileSize, normalisePaginatedItems } from '../components/document-format';
import {
  useCreateDocumentTag,
  useCreateFolder,
  useDocument,
  useDocumentActivity,
  useDocumentSearch,
  useDocumentTags,
  useDocumentVersions,
  useDocuments,
  useFolders,
  useUploadDocument,
} from '../hooks/use-documents';

const documentQuickActions: Array<{ title: string; description: string; to: string }> = [
  {
    title: 'Upload document',
    description: 'Add files with validation and metadata.',
    to: '/app/documents/all',
  },
  {
    title: 'Create folder',
    description: 'Organise nested knowledge spaces.',
    to: '/app/documents/folders',
  },
  {
    title: 'Create note',
    description: 'Prepare a simple markdown knowledge note.',
    to: '/app/documents/new-note',
  },
  {
    title: 'Search knowledge',
    description: 'Find documents, tags, owners, and links.',
    to: '/app/documents/search',
  },
  {
    title: 'Recent activity',
    description: 'Review what changed across knowledge.',
    to: '/app/documents/search',
  },
  {
    title: 'Open trash',
    description: 'Restore deleted records later.',
    to: '/app/documents/trash',
  },
];

function DocumentsActions() {
  return (
    <>
      <Link to="/app/documents/all">
        <Button>
          <Upload className="mr-2 size-4" />
          Upload document
        </Button>
      </Link>
      <Link to="/app/documents/folders">
        <Button variant="outline">
          <FolderPlus className="mr-2 size-4" />
          Create folder
        </Button>
      </Link>
    </>
  );
}

export function DocumentsHomePage() {
  const documentsQuery = useDocuments({ pageSize: 8 });
  const foldersQuery = useFolders();
  const tagsQuery = useDocumentTags();
  const documents = normalisePaginatedItems(documentsQuery.data);
  const folders = foldersQuery.data ?? [];
  const totalSize = documents.reduce((sum, document) => sum + document.fileSize, 0);
  const pinned = documents.filter((document) => document.isPinned);

  return (
    <DocumentShell
      title="Company knowledge hub"
      description="Store, organise, link, preview, version, and prepare every important file for the organisation intelligence layer."
      actions={<DocumentsActions />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KnowledgeStatsCard
          label="Documents"
          value={documents.length}
          hint="Indexed metadata records in this workspace."
        />
        <KnowledgeStatsCard
          label="Folders"
          value={folders.length}
          hint="Navigation structures for company knowledge."
        />
        <KnowledgeStatsCard
          label="Storage used"
          value={formatFileSize(totalSize)}
          hint="Plan usage placeholder."
        />
        <KnowledgeStatsCard
          label="AI indexed"
          value="Prepared"
          hint="Future semantic memory and RAG pipeline."
          tone="ai"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {documentQuickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            to={action.to}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="premium-card p-5">
          <h3 className="font-semibold">Recent documents</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {documents.map((document) => (
              <QuickActionCard
                key={document.id}
                title={document.title}
                description={`${document.documentType} · ${document.owner?.name ?? 'Unknown owner'}`}
                to={`/app/documents/${document.id}`}
              />
            ))}
          </div>
          {!documents.length && !documentsQuery.isLoading ? (
            <EmptyKnowledgeState
              title="No documents uploaded"
              description="Start by adding a document, note, policy, contract, report, or customer file."
            />
          ) : null}
          {documentsQuery.isLoading ? <DocumentSkeleton rows={4} /> : null}
        </section>
        <div className="grid gap-4">
          <AiKnowledgePlaceholder title="AI Knowledge memory" />
          <section className="premium-card p-5">
            <h3 className="font-semibold">Pinned and shared</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {pinned.length} pinned documents · Shared with me UI prepared.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(tagsQuery.data ?? []).slice(0, 6).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md border px-2 py-1 text-xs"
                  style={{ borderColor: tag.colour }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DocumentShell>
  );
}

export function DocumentsAllPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [viewMode, setViewMode] = useState<DocumentViewMode>('grid');
  const [metadataOpen, setMetadataOpen] = useState(true);
  const documentsQuery = useDocuments({ search, documentType: type, visibility });
  const foldersQuery = useFolders();
  const uploadDocument = useUploadDocument();
  const documents = normalisePaginatedItems(documentsQuery.data);

  const createDemoDocument = () => {
    uploadDocument.mutate({
      title: 'Knowledge note draft',
      description: 'Simple markdown note prepared from the frontend.',
      originalFileName: `knowledge-note-${Date.now()}.md`,
      mimeType: 'text/markdown',
      fileSize: 256,
      checksum: `frontend-${Date.now()}-checksum-value`,
    });
  };

  return (
    <DocumentShell
      title="All documents"
      description="Browse the company brain with grid, list, compact views, filters, upload queue, metadata, and quick preview."
      actions={<DocumentsActions />}
    >
      <div className="grid gap-4 xl:grid-cols-[240px_1fr_300px]">
        <FolderTree folders={foldersQuery.data ?? []} />
        <div className="grid gap-4">
          <div className="premium-card grid gap-3 p-4 lg:grid-cols-[1fr_auto]">
            <DocumentSearchBar value={search} onChange={setSearch} />
            <DocumentFilters
              type={type}
              visibility={visibility}
              onTypeChange={setType}
              onVisibilityChange={setVisibility}
            />
          </div>
          <UploadDropzone onUploadClick={createDemoDocument} />
          {documentsQuery.isError ? (
            <DocumentErrorState onRetry={() => void documentsQuery.refetch()} />
          ) : null}
          {documentsQuery.isLoading ? <DocumentSkeleton /> : null}
          {!documentsQuery.isLoading && !documents.length ? (
            <EmptyKnowledgeState
              title="No matching documents"
              description="Adjust filters or upload a new file to start building the knowledge hub."
            />
          ) : null}
          <DocumentFileManager
            documents={documents}
            folders={foldersQuery.data ?? []}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedIds={[]}
            onToggleMetadata={() => setMetadataOpen((value) => !value)}
          />
        </div>
        {metadataOpen ? (
          <div className="grid gap-4">
            <UploadQueue />
            <AiKnowledgePlaceholder title="Suggested tags" compact />
          </div>
        ) : null}
      </div>
    </DocumentShell>
  );
}

export function DocumentsFoldersPage() {
  const [name, setName] = useState('');
  const foldersQuery = useFolders();
  const createFolder = useCreateFolder();

  return (
    <DocumentShell
      title="Folders"
      description="Nested folders with breadcrumbs, tree navigation, colour/icon display, document counts, permissions, and recent activity indicators."
      actions={<DocumentsActions />}
    >
      <form
        className="premium-card grid gap-3 p-4 md:grid-cols-[1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) {
            createFolder.mutate({ name });
            setName('');
          }
        }}
      >
        <TextField
          label="New folder name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Policies, Contracts, Playbooks..."
        />
        <Button className="self-end" type="submit">
          Create folder
        </Button>
      </form>
      {foldersQuery.isLoading ? <DocumentSkeleton rows={4} /> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(foldersQuery.data ?? []).map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </div>
      {!foldersQuery.isLoading && !(foldersQuery.data ?? []).length ? (
        <EmptyKnowledgeState
          title="No folders yet"
          description="Create a calm structure for contracts, policies, client files, project knowledge, and internal notes."
          actionLabel="Create folder"
          actionTo="/app/documents/folders"
        />
      ) : null}
    </DocumentShell>
  );
}

export function DocumentFolderDetailPage() {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState<DocumentViewMode>('list');
  const documentsQuery = useDocuments({ folderId: id });
  const childFoldersQuery = useFolders(id);
  const documents = normalisePaginatedItems(documentsQuery.data);

  return (
    <DocumentShell
      title="Folder details"
      description="Everything in this folder, with breadcrumbs, nested folders, activity, permissions, and quick metadata inspection."
      actions={<DocumentsActions />}
    >
      <DocumentFileManager
        documents={documents}
        folders={childFoldersQuery.data ?? []}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedIds={[]}
        onToggleMetadata={() => undefined}
      />
      {!documents.length && !(childFoldersQuery.data ?? []).length && !documentsQuery.isLoading ? (
        <EmptyKnowledgeState
          title="This folder is empty"
          description="Upload files or create nested folders to keep this knowledge space useful."
        />
      ) : null}
    </DocumentShell>
  );
}

function useCurrentDocument() {
  const { id } = useParams();
  const documentQuery = useDocument(id);
  const versionsQuery = useDocumentVersions(id);
  const activityQuery = useDocumentActivity(id);
  return { id, documentQuery, versionsQuery, activityQuery };
}

export function DocumentDetailPage() {
  const { documentQuery, versionsQuery, activityQuery } = useCurrentDocument();
  const document = documentQuery.data;
  const links = useMemo(() => document?.links ?? [], [document]);

  return (
    <DocumentShell
      title={document?.title ?? 'Document profile'}
      description="A complete knowledge profile: preview, metadata, versions, permissions, activity, linked records, tags, owner, and AI readiness."
      actions={<DocumentsActions />}
    >
      {documentQuery.isLoading ? <DocumentSkeleton rows={5} /> : null}
      {documentQuery.isError ? (
        <DocumentErrorState onRetry={() => void documentQuery.refetch()} />
      ) : null}
      {document ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            <DocumentPreview document={document} />
            <AiDocumentPanel />
            <KnowledgeGraphPlaceholder />
            <div className="grid gap-4 md:grid-cols-2">
              {links.map((link) => (
                <LinkedRecordCard key={link.id} link={link} />
              ))}
              {!links.length ? (
                <AiKnowledgePlaceholder title="Linked records prepared" compact />
              ) : null}
            </div>
            <DocumentVersionList
              versions={versionsQuery.data ?? []}
              currentVersionId={document.currentVersion?.id}
            />
            <DocumentActivityTimeline activities={activityQuery.data ?? []} />
          </div>
          <div className="grid content-start gap-4">
            <DocumentMetadataPanel document={document} />
            <DocumentPermissionPanel document={document} />
            <CollaborationPlaceholder />
          </div>
        </div>
      ) : null}
    </DocumentShell>
  );
}

export function DocumentPreviewPage() {
  const { documentQuery } = useCurrentDocument();
  return (
    <DocumentShell
      title="Document preview"
      description="Preview architecture for PDFs, images, text, markdown, CSV, and premium fallback states."
    >
      <DocumentPreview document={documentQuery.data} />
    </DocumentShell>
  );
}

export function DocumentVersionsPage() {
  const { documentQuery, versionsQuery } = useCurrentDocument();
  return (
    <DocumentShell
      title="Document versions"
      description="Understand file history, current version, upload notes, restore placeholders, and download actions."
    >
      <DocumentVersionList
        versions={versionsQuery.data ?? []}
        currentVersionId={documentQuery.data?.currentVersion?.id}
      />
    </DocumentShell>
  );
}

export function DocumentPermissionsPage() {
  const { documentQuery } = useCurrentDocument();
  return (
    <DocumentShell
      title="Document permissions"
      description="Owner, user, team, role, inherited folder permissions, and future external sharing controls."
    >
      <DocumentPermissionPanel document={documentQuery.data} />
    </DocumentShell>
  );
}

export function DocumentActivityPage() {
  const { activityQuery } = useCurrentDocument();
  return (
    <DocumentShell
      title="Document activity"
      description="A readable timeline for uploads, views, downloads, moves, deletes, versions, tags, links, and permission changes."
    >
      <DocumentActivityTimeline activities={activityQuery.data ?? []} />
    </DocumentShell>
  );
}

export function DocumentsSearchPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const resultsQuery = useDocumentSearch({ search, documentType: type, visibility });
  const documents = normalisePaginatedItems(resultsQuery.data);

  return (
    <DocumentShell
      title="Search knowledge"
      description="Powerful search across titles, file names, descriptions, tags, owners, folders, linked records, and file types."
    >
      <div className="premium-card grid gap-3 p-4 lg:grid-cols-[1fr_auto]">
        <DocumentSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search documents, tags, owners, linked records..."
        />
        <DocumentFilters
          type={type}
          visibility={visibility}
          onTypeChange={setType}
          onVisibilityChange={setVisibility}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <DocumentFileManager
          documents={documents}
          folders={[]}
          viewMode="list"
          onViewModeChange={() => undefined}
          selectedIds={[]}
          onToggleMetadata={() => undefined}
        />
        <div className="grid content-start gap-4">
          <section className="premium-card p-5">
            <h3 className="font-semibold">Search intelligence</h3>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <span>Recent searches placeholder</span>
              <span>Saved searches placeholder</span>
              <span>Highlighted matches prepared</span>
              <span>Semantic answers prepared</span>
            </div>
          </section>
          <AiKnowledgePlaceholder title="AI answers from knowledge" />
        </div>
      </div>
      {!documents.length && search ? (
        <EmptyKnowledgeState
          title="No search results"
          description="Try a different term or filter. Future semantic search will suggest related documents."
        />
      ) : null}
    </DocumentShell>
  );
}

export function DocumentTagsPage() {
  const [name, setName] = useState('');
  const tagsQuery = useDocumentTags();
  const createTag = useCreateDocumentTag();

  return (
    <DocumentShell
      title="Tags"
      description="Create, colour, filter, assign, and remove tags with the same calm taxonomy pattern as CRM and Projects."
    >
      <form
        className="premium-card grid gap-3 p-4 md:grid-cols-[1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) {
            createTag.mutate({ name, colour: '#111827' });
            setName('');
          }
        }}
      >
        <TextField
          label="Tag name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Policy, Contract, Playbook..."
        />
        <Button className="self-end" type="submit">
          Create tag
        </Button>
      </form>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(tagsQuery.data ?? []).map((tag) => (
          <div key={tag.id} className="premium-card p-4">
            <span
              className="inline-flex rounded-md border px-2 py-1 text-xs"
              style={{ borderColor: tag.colour }}
            >
              {tag.name}
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              {tag.description ?? 'Tag assignment and filtering ready.'}
            </p>
          </div>
        ))}
      </div>
    </DocumentShell>
  );
}

export function DocumentsTrashPage() {
  return (
    <DocumentShell
      title="Trash"
      description="Deleted documents and folders live here. Restore and permanent delete actions are placeholders until safe backend deletion ships."
    >
      <EmptyKnowledgeState
        title="Trash is empty"
        description="Deleted documents and folders will appear here with restore placeholders and safe permanent deletion preparation."
        actionLabel="Back to documents"
        actionTo="/app/documents"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="premium-card border-dashed p-5">
          <Trash2 className="size-5 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">Restore placeholder</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Backend restore architecture exists for documents; folder restore UI is prepared.
          </p>
        </div>
        <div className="premium-card border-dashed p-5">
          <Archive className="size-5 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">Permanent delete placeholder</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Not enabled until the backend supports safe irreversible deletion.
          </p>
        </div>
      </div>
    </DocumentShell>
  );
}

export function DocumentsNotePlaceholderPage() {
  return (
    <DocumentShell
      title="Create note"
      description="Simple markdown knowledge notes are prepared: title, content, save, edit, preview, tags, folder assignment, and linked records."
    >
      <div className="premium-card grid gap-4 p-5">
        <TextField label="Note title" placeholder="Internal process, policy, decision record..." />
        <textarea
          className="min-h-48 rounded-md border bg-background p-3 text-sm outline-none"
          placeholder="Write markdown content..."
        />
        <div className="flex flex-wrap gap-2">
          <Button>
            <NotebookPen className="mr-2 size-4" />
            Save placeholder
          </Button>
          <Button variant="outline">
            <FilePlus2 className="mr-2 size-4" />
            Preview
          </Button>
          <Button asChild variant="ghost">
            <Link to="/app/documents">
              <Search className="mr-2 size-4" />
              Search knowledge
            </Link>
          </Button>
        </div>
      </div>
    </DocumentShell>
  );
}
