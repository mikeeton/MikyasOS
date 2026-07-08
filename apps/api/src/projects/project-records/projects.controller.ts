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

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { WorkIdParam } from '../common/work-params';
import { ListWorkRecordsDto } from '../dto/list-work-records.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller({ path: 'projects', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.projects.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('Project.Read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.projects.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Project.Create')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projects.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Project.Update')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projects.update(organisationId, user.id, params.id, dto);
  }

  @Post(':id/archive')
  @RequirePermissions('Project.Update')
  archive(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
  ) {
    return this.projects.archive(organisationId, user.id, params.id);
  }

  @Post(':id/restore')
  @RequirePermissions('Project.Update')
  restore(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
  ) {
    return this.projects.restore(organisationId, user.id, params.id);
  }

  @Delete(':id')
  @RequirePermissions('Project.Delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
  ) {
    return this.projects.remove(organisationId, user.id, params.id);
  }
}
