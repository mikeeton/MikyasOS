import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { AssignDocumentTagDto, CreateDocumentTagDto } from '../dto/create-document-tag.dto';
import { DocumentIdParamDto } from '../dto/document-id-param.dto';
import { DocumentTagsService } from './document-tags.service';

@Controller({ path: 'document-tags', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentTagsController {
  constructor(private readonly tags: DocumentTagsService) {}

  @Get()
  @RequirePermissions('Document.Read')
  list(@CurrentOrganisation() organisationId: string) {
    return this.tags.list(organisationId);
  }

  @Post()
  @RequirePermissions('DocumentTag.Manage')
  create(@CurrentOrganisation() organisationId: string, @Body() dto: CreateDocumentTagDto) {
    return this.tags.create(organisationId, dto);
  }

  @Delete(':id')
  @RequirePermissions('DocumentTag.Manage')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: DocumentIdParamDto) {
    return this.tags.remove(organisationId, params.id);
  }
}

@Controller({ path: 'documents/:id/tags', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentTagAssignmentsController {
  constructor(private readonly tags: DocumentTagsService) {}

  @Post()
  @RequirePermissions('Document.Update')
  assign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
    @Body() dto: AssignDocumentTagDto,
  ) {
    return this.tags.assign(organisationId, user.id, params.id, dto.tagId);
  }

  @Delete(':tagId')
  @RequirePermissions('Document.Update')
  unassign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') documentId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tags.unassign(organisationId, user.id, documentId, tagId);
  }
}
