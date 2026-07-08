import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { WorkIdParam } from '../common/work-params';
import { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { CreateProjectFileDto } from './dto/create-project-file.dto';
import { ProjectFilesService } from './project-files.service';

@Controller({ path: 'project-files', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ProjectFilesController {
  constructor(private readonly files: ProjectFilesService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.files.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('Files.Upload')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProjectFileDto,
  ) {
    return this.files.create(organisationId, user.id, dto);
  }

  @Get(':id/download')
  @RequirePermissions('Project.Read')
  download(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.files.download(organisationId, params.id);
  }

  @Delete(':id')
  @RequirePermissions('Files.Delete')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.files.remove(organisationId, params.id);
  }
}
