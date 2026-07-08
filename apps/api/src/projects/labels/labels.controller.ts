import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentOrganisation } from '../../auth/decorators/current-organisation.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganisationGuard } from '../../auth/guards/organisation.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-request';
import { WorkIdParam } from '../common/work-params';
import { AssignProjectLabelDto } from './dto/assign-project-label.dto';
import { CreateProjectLabelDto } from './dto/create-project-label.dto';
import { UpdateProjectLabelDto } from './dto/update-project-label.dto';
import { LabelsService } from './labels.service';

@Controller({ path: 'labels', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class LabelsController {
  constructor(private readonly labels: LabelsService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string) {
    return this.labels.list(organisationId);
  }

  @Post()
  @RequirePermissions('Task.Update')
  create(@CurrentOrganisation() organisationId: string, @Body() dto: CreateProjectLabelDto) {
    return this.labels.create(organisationId, dto);
  }

  @Patch(':id')
  @RequirePermissions('Task.Update')
  update(
    @CurrentOrganisation() organisationId: string,
    @Param() params: WorkIdParam,
    @Body() dto: UpdateProjectLabelDto,
  ) {
    return this.labels.update(organisationId, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Task.Update')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.labels.remove(organisationId, params.id);
  }

  @Post('assign')
  @RequirePermissions('Task.Update')
  assign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignProjectLabelDto,
  ) {
    return this.labels.assign(organisationId, user.id, dto);
  }

  @Post('unassign')
  @RequirePermissions('Task.Update')
  unassign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignProjectLabelDto,
  ) {
    return this.labels.unassign(organisationId, user.id, dto);
  }
}
