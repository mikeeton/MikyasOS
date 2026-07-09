import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { CreateDocumentLinkDto } from '../dto/create-document-link.dto';
import { DocumentLinkIdParamDto, DocumentIdParamDto } from '../dto/document-id-param.dto';
import { DocumentLinksService } from './document-links.service';

@Controller({ path: 'documents/:id/links', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentLinksController {
  constructor(private readonly links: DocumentLinksService) {}

  @Post()
  @RequirePermissions('Document.Update')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
    @Body() dto: CreateDocumentLinkDto,
  ) {
    return this.links.create(organisationId, user.id, params.id, dto);
  }

  @Delete(':linkId')
  @RequirePermissions('Document.Update')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentLinkIdParamDto,
  ) {
    return this.links.remove(organisationId, user.id, params.id, params.linkId);
  }
}
