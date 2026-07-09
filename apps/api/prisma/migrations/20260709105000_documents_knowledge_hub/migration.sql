-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PDF', 'DOCX', 'XLSX', 'CSV', 'IMAGE', 'TEXT', 'MARKDOWN', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('ACTIVE', 'PROCESSING', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('PRIVATE', 'ORGANISATION', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "DocumentPermissionLevel" AS ENUM ('VIEW', 'COMMENT', 'EDIT', 'MANAGE', 'OWNER');

-- CreateEnum
CREATE TYPE "DocumentActivityAction" AS ENUM ('DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_EDITED', 'DOCUMENT_RENAMED', 'DOCUMENT_MOVED', 'DOCUMENT_DELETED', 'DOCUMENT_RESTORED', 'VERSION_UPLOADED', 'VERSION_RESTORED', 'PERMISSION_CHANGED', 'FOLDER_CREATED', 'FOLDER_RENAMED', 'FOLDER_MOVED', 'FOLDER_DELETED', 'TAG_ADDED', 'TAG_REMOVED', 'DOCUMENT_LINKED', 'DOCUMENT_UNLINKED');

-- CreateEnum
CREATE TYPE "DocumentLinkEntityType" AS ENUM ('COMPANY', 'CONTACT', 'PROJECT', 'TASK', 'INVOICE', 'MEETING', 'AUTOMATION');

-- CreateTable
CREATE TABLE "Folder" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "parentFolderId" UUID,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "colour" TEXT,
    "icon" TEXT,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'ORGANISATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "folderId" UUID,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileExtension" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "status" "DocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'ORGANISATION',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "currentVersionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "uploadedById" UUID,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentPermission" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID,
    "folderId" UUID,
    "userId" UUID,
    "teamId" UUID,
    "roleId" UUID,
    "permissionLevel" "DocumentPermissionLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentActivity" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID,
    "folderId" UUID,
    "actorId" UUID,
    "action" "DocumentActivityAction" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTag" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL DEFAULT '#111827',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTagAssignment" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentTagAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentLink" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "entityType" "DocumentLinkEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentShare" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Folder_organisationId_parentFolderId_idx" ON "Folder"("organisationId", "parentFolderId");

-- CreateIndex
CREATE INDEX "Folder_organisationId_ownerId_idx" ON "Folder"("organisationId", "ownerId");

-- CreateIndex
CREATE INDEX "Folder_organisationId_path_idx" ON "Folder"("organisationId", "path");

-- CreateIndex
CREATE INDEX "Folder_organisationId_deletedAt_idx" ON "Folder"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Folder_organisationId_createdAt_idx" ON "Folder"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_organisationId_parentFolderId_name_key" ON "Folder"("organisationId", "parentFolderId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Document_currentVersionId_key" ON "Document"("currentVersionId");

-- CreateIndex
CREATE INDEX "Document_organisationId_folderId_idx" ON "Document"("organisationId", "folderId");

-- CreateIndex
CREATE INDEX "Document_organisationId_ownerId_idx" ON "Document"("organisationId", "ownerId");

-- CreateIndex
CREATE INDEX "Document_organisationId_title_idx" ON "Document"("organisationId", "title");

-- CreateIndex
CREATE INDEX "Document_organisationId_documentType_idx" ON "Document"("organisationId", "documentType");

-- CreateIndex
CREATE INDEX "Document_organisationId_status_idx" ON "Document"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Document_organisationId_visibility_idx" ON "Document"("organisationId", "visibility");

-- CreateIndex
CREATE INDEX "Document_organisationId_mimeType_idx" ON "Document"("organisationId", "mimeType");

-- CreateIndex
CREATE INDEX "Document_organisationId_checksum_idx" ON "Document"("organisationId", "checksum");

-- CreateIndex
CREATE INDEX "Document_organisationId_deletedAt_idx" ON "Document"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Document_organisationId_createdAt_idx" ON "Document"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "Document_organisationId_updatedAt_idx" ON "Document"("organisationId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Document_organisationId_storageKey_key" ON "Document"("organisationId", "storageKey");

-- CreateIndex
CREATE INDEX "DocumentVersion_organisationId_documentId_idx" ON "DocumentVersion"("organisationId", "documentId");

-- CreateIndex
CREATE INDEX "DocumentVersion_organisationId_uploadedById_idx" ON "DocumentVersion"("organisationId", "uploadedById");

-- CreateIndex
CREATE INDEX "DocumentVersion_organisationId_createdAt_idx" ON "DocumentVersion"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_versionNumber_key" ON "DocumentVersion"("documentId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_organisationId_storageKey_key" ON "DocumentVersion"("organisationId", "storageKey");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_documentId_idx" ON "DocumentPermission"("organisationId", "documentId");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_folderId_idx" ON "DocumentPermission"("organisationId", "folderId");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_userId_idx" ON "DocumentPermission"("organisationId", "userId");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_teamId_idx" ON "DocumentPermission"("organisationId", "teamId");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_roleId_idx" ON "DocumentPermission"("organisationId", "roleId");

-- CreateIndex
CREATE INDEX "DocumentPermission_organisationId_permissionLevel_idx" ON "DocumentPermission"("organisationId", "permissionLevel");

-- CreateIndex
CREATE INDEX "DocumentActivity_organisationId_documentId_createdAt_idx" ON "DocumentActivity"("organisationId", "documentId", "createdAt");

-- CreateIndex
CREATE INDEX "DocumentActivity_organisationId_folderId_createdAt_idx" ON "DocumentActivity"("organisationId", "folderId", "createdAt");

-- CreateIndex
CREATE INDEX "DocumentActivity_organisationId_actorId_idx" ON "DocumentActivity"("organisationId", "actorId");

-- CreateIndex
CREATE INDEX "DocumentActivity_organisationId_action_idx" ON "DocumentActivity"("organisationId", "action");

-- CreateIndex
CREATE INDEX "DocumentActivity_organisationId_createdAt_idx" ON "DocumentActivity"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "DocumentTag_organisationId_deletedAt_idx" ON "DocumentTag"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "DocumentTag_organisationId_createdAt_idx" ON "DocumentTag"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentTag_organisationId_name_key" ON "DocumentTag"("organisationId", "name");

-- CreateIndex
CREATE INDEX "DocumentTagAssignment_organisationId_documentId_idx" ON "DocumentTagAssignment"("organisationId", "documentId");

-- CreateIndex
CREATE INDEX "DocumentTagAssignment_organisationId_tagId_idx" ON "DocumentTagAssignment"("organisationId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentTagAssignment_documentId_tagId_key" ON "DocumentTagAssignment"("documentId", "tagId");

-- CreateIndex
CREATE INDEX "DocumentLink_organisationId_documentId_idx" ON "DocumentLink"("organisationId", "documentId");

-- CreateIndex
CREATE INDEX "DocumentLink_organisationId_entityType_entityId_idx" ON "DocumentLink"("organisationId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "DocumentLink_organisationId_createdAt_idx" ON "DocumentLink"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentLink_documentId_entityType_entityId_key" ON "DocumentLink"("documentId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShare_tokenHash_key" ON "DocumentShare"("tokenHash");

-- CreateIndex
CREATE INDEX "DocumentShare_organisationId_documentId_idx" ON "DocumentShare"("organisationId", "documentId");

-- CreateIndex
CREATE INDEX "DocumentShare_organisationId_expiresAt_idx" ON "DocumentShare"("organisationId", "expiresAt");

-- CreateIndex
CREATE INDEX "DocumentShare_organisationId_revokedAt_idx" ON "DocumentShare"("organisationId", "revokedAt");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "DocumentVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPermission" ADD CONSTRAINT "DocumentPermission_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPermission" ADD CONSTRAINT "DocumentPermission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPermission" ADD CONSTRAINT "DocumentPermission_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPermission" ADD CONSTRAINT "DocumentPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPermission" ADD CONSTRAINT "DocumentPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentActivity" ADD CONSTRAINT "DocumentActivity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentActivity" ADD CONSTRAINT "DocumentActivity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentActivity" ADD CONSTRAINT "DocumentActivity_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentActivity" ADD CONSTRAINT "DocumentActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTag" ADD CONSTRAINT "DocumentTag_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTagAssignment" ADD CONSTRAINT "DocumentTagAssignment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTagAssignment" ADD CONSTRAINT "DocumentTagAssignment_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "DocumentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLink" ADD CONSTRAINT "DocumentLink_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLink" ADD CONSTRAINT "DocumentLink_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShare" ADD CONSTRAINT "DocumentShare_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
