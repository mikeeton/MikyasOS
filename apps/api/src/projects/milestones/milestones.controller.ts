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
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestonesService } from './milestones.service';

@Controller({ path: 'milestones', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class MilestonesController {
  constructor(private readonly milestones: MilestonesService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.milestones.list(organisationId, query);
  }

  @Post()
  @RequirePermissions('Milestones.Manage')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMilestoneDto,
  ) {
    return this.milestones.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Milestones.Manage')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.milestones.update(organisationId, user.id, params.id, dto);
  }

  @Delete(':id')
  @RequirePermissions('Milestones.Manage')
  remove(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.milestones.remove(organisationId, params.id);
  }
}
