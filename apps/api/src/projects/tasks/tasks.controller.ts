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
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller({ path: 'tasks', version: '1' })
@UseGuards(JwtAuthGuard, OrganisationGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @RequirePermissions('Project.Read')
  list(@CurrentOrganisation() organisationId: string, @Query() query: ListWorkRecordsDto) {
    return this.tasks.list(organisationId, query);
  }

  @Get(':id')
  @RequirePermissions('Project.Read')
  findOne(@CurrentOrganisation() organisationId: string, @Param() params: WorkIdParam) {
    return this.tasks.findOne(organisationId, params.id);
  }

  @Post()
  @RequirePermissions('Task.Create')
  create(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasks.create(organisationId, user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('Task.Update')
  update(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(organisationId, user.id, params.id, dto);
  }

  @Post(':id/move')
  @RequirePermissions('Task.Update')
  move(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasks.move(organisationId, user.id, params.id, dto);
  }

  @Post(':id/assign')
  @RequirePermissions('Task.Assign')
  assign(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
    @Body() dto: AssignTaskDto,
  ) {
    return this.tasks.assign(organisationId, user.id, params.id, dto);
  }

  @Post(':id/complete')
  @RequirePermissions('Task.Update')
  complete(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
  ) {
    return this.tasks.complete(organisationId, user.id, params.id);
  }

  @Delete(':id')
  @RequirePermissions('Task.Delete')
  remove(
    @CurrentOrganisation() organisationId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WorkIdParam,
  ) {
    return this.tasks.remove(organisationId, user.id, params.id);
  }
}
