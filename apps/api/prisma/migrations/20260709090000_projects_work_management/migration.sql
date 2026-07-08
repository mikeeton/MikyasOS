-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'MISSED');

-- CreateEnum
CREATE TYPE "ProjectActivityType" AS ENUM ('PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_ARCHIVED', 'PROJECT_RESTORED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_MOVED', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'COMMENT_ADDED', 'FILE_UPLOADED', 'MILESTONE_UPDATED', 'STATUS_CHANGED', 'LABEL_CHANGED', 'TIME_TRACKED');

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "budget" DECIMAL(14,2),
    "estimatedHours" DECIMAL(10,2),
    "actualHours" DECIMAL(10,2),
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "parentTaskId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" UUID,
    "reporterId" UUID,
    "estimatedHours" DECIMAL(10,2),
    "actualHours" DECIMAL(10,2),
    "dueDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLabel" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL DEFAULT '#111827',
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLabel" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "labelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectComment" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "taskId" UUID,
    "parentCommentId" UUID,
    "authorId" UUID,
    "content" TEXT NOT NULL,
    "mentions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "taskId" UUID,
    "commentId" UUID,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBoard" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBoardColumn" (
    "id" UUID NOT NULL,
    "boardId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TaskStatus",
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectBoardColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectActivity" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "taskId" UUID,
    "milestoneId" UUID,
    "actorUserId" UUID,
    "type" "ProjectActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_organisationId_name_idx" ON "Project"("organisationId", "name");

-- CreateIndex
CREATE INDEX "Project_organisationId_companyId_idx" ON "Project"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "Project_organisationId_ownerId_idx" ON "Project"("organisationId", "ownerId");

-- CreateIndex
CREATE INDEX "Project_organisationId_status_idx" ON "Project"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Project_organisationId_priority_idx" ON "Project"("organisationId", "priority");

-- CreateIndex
CREATE INDEX "Project_organisationId_dueDate_idx" ON "Project"("organisationId", "dueDate");

-- CreateIndex
CREATE INDEX "Project_organisationId_archivedAt_idx" ON "Project"("organisationId", "archivedAt");

-- CreateIndex
CREATE INDEX "Project_organisationId_deletedAt_idx" ON "Project"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Project_organisationId_createdAt_idx" ON "Project"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "Task_organisationId_projectId_idx" ON "Task"("organisationId", "projectId");

-- CreateIndex
CREATE INDEX "Task_organisationId_parentTaskId_idx" ON "Task"("organisationId", "parentTaskId");

-- CreateIndex
CREATE INDEX "Task_organisationId_assigneeId_idx" ON "Task"("organisationId", "assigneeId");

-- CreateIndex
CREATE INDEX "Task_organisationId_reporterId_idx" ON "Task"("organisationId", "reporterId");

-- CreateIndex
CREATE INDEX "Task_organisationId_status_idx" ON "Task"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Task_organisationId_priority_idx" ON "Task"("organisationId", "priority");

-- CreateIndex
CREATE INDEX "Task_organisationId_dueDate_idx" ON "Task"("organisationId", "dueDate");

-- CreateIndex
CREATE INDEX "Task_organisationId_position_idx" ON "Task"("organisationId", "position");

-- CreateIndex
CREATE INDEX "Task_organisationId_deletedAt_idx" ON "Task"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Task_organisationId_createdAt_idx" ON "Task"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_status_idx" ON "ProjectMilestone"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_dueDate_idx" ON "ProjectMilestone"("projectId", "dueDate");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_deletedAt_idx" ON "ProjectMilestone"("projectId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProjectLabel_organisationId_deletedAt_idx" ON "ProjectLabel"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProjectLabel_organisationId_createdAt_idx" ON "ProjectLabel"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLabel_organisationId_name_key" ON "ProjectLabel"("organisationId", "name");

-- CreateIndex
CREATE INDEX "TaskLabel_labelId_idx" ON "TaskLabel"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskLabel_taskId_labelId_key" ON "TaskLabel"("taskId", "labelId");

-- CreateIndex
CREATE INDEX "ProjectComment_organisationId_projectId_createdAt_idx" ON "ProjectComment"("organisationId", "projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectComment_organisationId_taskId_createdAt_idx" ON "ProjectComment"("organisationId", "taskId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectComment_organisationId_parentCommentId_idx" ON "ProjectComment"("organisationId", "parentCommentId");

-- CreateIndex
CREATE INDEX "ProjectComment_organisationId_authorId_idx" ON "ProjectComment"("organisationId", "authorId");

-- CreateIndex
CREATE INDEX "ProjectComment_organisationId_deletedAt_idx" ON "ProjectComment"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_projectId_idx" ON "ProjectFile"("organisationId", "projectId");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_taskId_idx" ON "ProjectFile"("organisationId", "taskId");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_commentId_idx" ON "ProjectFile"("organisationId", "commentId");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_uploadedById_idx" ON "ProjectFile"("organisationId", "uploadedById");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_mimeType_idx" ON "ProjectFile"("organisationId", "mimeType");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_deletedAt_idx" ON "ProjectFile"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProjectFile_organisationId_createdAt_idx" ON "ProjectFile"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectFile_organisationId_storageKey_key" ON "ProjectFile"("organisationId", "storageKey");

-- CreateIndex
CREATE INDEX "TimeEntry_organisationId_taskId_idx" ON "TimeEntry"("organisationId", "taskId");

-- CreateIndex
CREATE INDEX "TimeEntry_organisationId_userId_idx" ON "TimeEntry"("organisationId", "userId");

-- CreateIndex
CREATE INDEX "TimeEntry_organisationId_startTime_idx" ON "TimeEntry"("organisationId", "startTime");

-- CreateIndex
CREATE INDEX "TimeEntry_organisationId_deletedAt_idx" ON "TimeEntry"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProjectBoard_organisationId_projectId_idx" ON "ProjectBoard"("organisationId", "projectId");

-- CreateIndex
CREATE INDEX "ProjectBoard_organisationId_deletedAt_idx" ON "ProjectBoard"("organisationId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectBoard_projectId_name_key" ON "ProjectBoard"("projectId", "name");

-- CreateIndex
CREATE INDEX "ProjectBoardColumn_boardId_position_idx" ON "ProjectBoardColumn"("boardId", "position");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_projectId_createdAt_idx" ON "ProjectActivity"("organisationId", "projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_taskId_createdAt_idx" ON "ProjectActivity"("organisationId", "taskId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_milestoneId_createdAt_idx" ON "ProjectActivity"("organisationId", "milestoneId", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_actorUserId_idx" ON "ProjectActivity"("organisationId", "actorUserId");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_type_idx" ON "ProjectActivity"("organisationId", "type");

-- CreateIndex
CREATE INDEX "ProjectActivity_organisationId_createdAt_idx" ON "ProjectActivity"("organisationId", "createdAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLabel" ADD CONSTRAINT "ProjectLabel_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabel" ADD CONSTRAINT "TaskLabel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabel" ADD CONSTRAINT "TaskLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "ProjectLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ProjectComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ProjectComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBoard" ADD CONSTRAINT "ProjectBoard_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBoard" ADD CONSTRAINT "ProjectBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBoardColumn" ADD CONSTRAINT "ProjectBoardColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "ProjectBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

