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
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { TimeTrackingService } from './time-tracking.service';

@Controller({ path: 'time-tracking', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class TimeTrackingController {
  constructor(private readonly timeTracking: TimeTrackingService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.timeTracking.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('TimeTracking.Manage')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTimeEntryDto,
  ) {
    return this.timeTracking.create(organisationId, user.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('TimeTracking.Manage')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.timeTracking.remove(organisationId, params.id);
  }
}
