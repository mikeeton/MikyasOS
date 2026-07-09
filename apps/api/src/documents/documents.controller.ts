import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganisation } from '../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../auth/guards/organisation.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentIdParamDto } from './dto/document-id-param.dto';
import { ListDocumentsDto } from './dto/list-documents.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';

@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  @RequirePermissions('Document.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListDocumentsDto) {
    return this.documents.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('Document.Read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: DocumentIdParamDto) {
    return this.documents.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Document.Create')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documents.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Document.Update')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documents.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Document.Delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
  ) {
    return this.documents.remove(organisationId, user.id, params.id);
  }

  @Post(':id/restore')
  @RequirePermissions('Document.Update')
  restore(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
  ) {
    return this.documents.restore(organisationId, user.id, params.id);
  }

  @Post(':id/download')
  @RequirePermissions('Document.Download')
  download(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
  ) {
    return this.documents.download(organisationId, user.id, params.id);
  }
}
