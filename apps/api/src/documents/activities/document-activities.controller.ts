import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { DocumentIdParamDto } from '../dto/document-id-param.dto';
import { DocumentActivitiesService } from './document-activities.service';

@Controller({ path: 'documents/:id/activity', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentActivitiesController {
  constructor(private readonly activities: DocumentActivitiesService) {}

  @Get()
  @RequirePermissions('Document.Read')
  list(@CurrentOrganisation() organisationId: string, @Param() params: DocumentIdParamDto) {
    return this.activities.listForDocument(organisationId, params.id);
  }
}
