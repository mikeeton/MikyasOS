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
import { IsOptional, IsUUID } from 'class-validator';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { DocumentIdParamDto } from '../dto/document-id-param.dto';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { FoldersService } from './folders.service';

class ListFoldersDto {
  @IsOptional()
  @IsUUID()
  parentFolderId?: string;
}

@Controller({ path: 'folders', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class FoldersController {
  constructor(private readonly folders: FoldersService) {}

  @Get()
  @RequirePermissions('Document.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListFoldersDto) {
    return this.folders.list(organisationId, query.parentFolderId);
  }

  @Post()
  @RequirePermissions('Folder.Create')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFolderDto,
  ) {
    return this.folders.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Folder.Update')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
    @Body() dto: UpdateFolderDto,
  ) {
    return this.folders.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Folder.Delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: DocumentIdParamDto,
  ) {
    return this.folders.remove(organisationId, user.id, params.id);
  }
}
