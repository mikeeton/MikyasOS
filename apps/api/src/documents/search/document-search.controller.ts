import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { ListDocumentsDto } from '../dto/list-documents.dto';
import { DocumentsService } from '../documents.service';

@Controller({ path: 'documents-search', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentSearchController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  @RequirePermissions('Document.Read')
  search(@CurrentOrganisation() organisationId: string, @Query() query: ListDocumentsDto) {
    return this.documents.list(organisationId, query);
  }
}
