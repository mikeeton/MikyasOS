import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { DocumentIdParamDto } from '../dto/document-id-param.dto';
import { UploadDocumentVersionDto } from '../dto/upload-document-version.dto';
import { DocumentVersionsService } from './document-versions.service';

class RestoreVersionParamDto extends DocumentIdParamDto {
  @IsUUID()
  versionId!: string;
}

@Controller({ path: 'documents/:id', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentVersionsController {
  constructor(private readonly versions: DocumentVersionsService) {}

  @Get('versions')
  @RequirePermissions('Document.Read')
  list(@CurrentOrganisation() organisationId: string, @Param() params: DocumentIdParamDto) {
    return this.versions.list(organisationId, params.id);
  }

  @Post('versions')
  @RequirePermissions('Document.UploadVersion')
  upload(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
    @Body() dto: UploadDocumentVersionDto,
  ) {
    return this.versions.upload(organisationId, user.id, params.id, dto);
  }

  @Post('restore-version/:versionId')
  @RequirePermissions('Document.UploadVersion')
  restore(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: RestoreVersionParamDto,
  ) {
    return this.versions.restore(organisationId, user.id, params.id, params.versionId);
  }
}
