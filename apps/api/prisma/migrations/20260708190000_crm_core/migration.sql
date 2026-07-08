-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'INACTIVE', 'CUSTOMER', 'PARTNER', 'SUPPLIER', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CustomerActivityType" AS ENUM ('COMPANY_CREATED', 'COMPANY_UPDATED', 'CONTACT_ADDED', 'LEAD_CREATED', 'LEAD_UPDATED', 'LEAD_CONVERTED', 'OPPORTUNITY_CREATED', 'OPPORTUNITY_UPDATED', 'OPPORTUNITY_WON', 'OPPORTUNITY_LOST', 'NOTE_ADDED', 'FILE_UPLOADED', 'TAG_CHANGED', 'CUSTOMER_EDITED');

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "annualRevenue" DECIMAL(14,2),
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postcode" TEXT,
    "linkedin" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'PROSPECT',
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "linkedin" TEXT,
    "avatar" TEXT,
    "birthday" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "assignedTo" UUID,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "probability" INTEGER NOT NULL DEFAULT 0,
    "estimatedValue" DECIMAL(14,2),
    "expectedCloseDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "owner" UUID,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'DISCOVERY',
    "probability" INTEGER NOT NULL DEFAULT 0,
    "estimatedRevenue" DECIMAL(14,2),
    "expectedCloseDate" TIMESTAMP(3),
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerNote" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "contactId" UUID,
    "authorId" UUID,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFile" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "contactId" UUID,
    "originalFilename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActivity" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "companyId" UUID,
    "contactId" UUID,
    "leadId" UUID,
    "opportunityId" UUID,
    "actorUserId" UUID,
    "type" "CustomerActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerTag" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#111827',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyTag" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_organisationId_name_idx" ON "Company"("organisationId", "name");

-- CreateIndex
CREATE INDEX "Company_organisationId_status_idx" ON "Company"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Company_organisationId_industry_idx" ON "Company"("organisationId", "industry");

-- CreateIndex
CREATE INDEX "Company_organisationId_country_idx" ON "Company"("organisationId", "country");

-- CreateIndex
CREATE INDEX "Company_organisationId_city_idx" ON "Company"("organisationId", "city");

-- CreateIndex
CREATE INDEX "Company_organisationId_deletedAt_idx" ON "Company"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Company_organisationId_createdAt_idx" ON "Company"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_organisationId_companyId_idx" ON "Contact"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "Contact_organisationId_email_idx" ON "Contact"("organisationId", "email");

-- CreateIndex
CREATE INDEX "Contact_organisationId_firstName_lastName_idx" ON "Contact"("organisationId", "firstName", "lastName");

-- CreateIndex
CREATE INDEX "Contact_organisationId_deletedAt_idx" ON "Contact"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Contact_organisationId_createdAt_idx" ON "Contact"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_organisationId_companyId_idx" ON "Lead"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "Lead_organisationId_assignedTo_idx" ON "Lead"("organisationId", "assignedTo");

-- CreateIndex
CREATE INDEX "Lead_organisationId_status_idx" ON "Lead"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Lead_organisationId_expectedCloseDate_idx" ON "Lead"("organisationId", "expectedCloseDate");

-- CreateIndex
CREATE INDEX "Lead_organisationId_deletedAt_idx" ON "Lead"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Lead_organisationId_createdAt_idx" ON "Lead"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_companyId_idx" ON "Opportunity"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_owner_idx" ON "Opportunity"("organisationId", "owner");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_stage_idx" ON "Opportunity"("organisationId", "stage");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_status_idx" ON "Opportunity"("organisationId", "status");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_expectedCloseDate_idx" ON "Opportunity"("organisationId", "expectedCloseDate");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_deletedAt_idx" ON "Opportunity"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Opportunity_organisationId_createdAt_idx" ON "Opportunity"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerNote_organisationId_companyId_idx" ON "CustomerNote"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "CustomerNote_organisationId_contactId_idx" ON "CustomerNote"("organisationId", "contactId");

-- CreateIndex
CREATE INDEX "CustomerNote_organisationId_authorId_idx" ON "CustomerNote"("organisationId", "authorId");

-- CreateIndex
CREATE INDEX "CustomerNote_organisationId_deletedAt_idx" ON "CustomerNote"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "CustomerNote_organisationId_createdAt_idx" ON "CustomerNote"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_companyId_idx" ON "CustomerFile"("organisationId", "companyId");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_contactId_idx" ON "CustomerFile"("organisationId", "contactId");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_uploadedById_idx" ON "CustomerFile"("organisationId", "uploadedById");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_mimeType_idx" ON "CustomerFile"("organisationId", "mimeType");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_deletedAt_idx" ON "CustomerFile"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "CustomerFile_organisationId_createdAt_idx" ON "CustomerFile"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerFile_organisationId_storageKey_key" ON "CustomerFile"("organisationId", "storageKey");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_companyId_createdAt_idx" ON "CustomerActivity"("organisationId", "companyId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_contactId_createdAt_idx" ON "CustomerActivity"("organisationId", "contactId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_leadId_createdAt_idx" ON "CustomerActivity"("organisationId", "leadId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_opportunityId_createdAt_idx" ON "CustomerActivity"("organisationId", "opportunityId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_type_idx" ON "CustomerActivity"("organisationId", "type");

-- CreateIndex
CREATE INDEX "CustomerActivity_organisationId_createdAt_idx" ON "CustomerActivity"("organisationId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerTag_organisationId_deletedAt_idx" ON "CustomerTag"("organisationId", "deletedAt");

-- CreateIndex
CREATE INDEX "CustomerTag_organisationId_createdAt_idx" ON "CustomerTag"("organisationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTag_organisationId_name_key" ON "CustomerTag"("organisationId", "name");

-- CreateIndex
CREATE INDEX "CompanyTag_tagId_idx" ON "CompanyTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyTag_companyId_tagId_key" ON "CompanyTag"("companyId", "tagId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTag" ADD CONSTRAINT "CustomerTag_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CustomerTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

