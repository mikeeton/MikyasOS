import { Module } from '@nestjs/common';

import { AuditLogsModule } from '../../audit-logs/audit-logs.module';
import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentActivitiesModule } from '../activities/document-activities.module';
import { DocumentAuthModule } from '../common/document-auth.module';
import { FoldersController } from './folders.controller';
import { FoldersRepository } from './folders.repository';
import { FoldersService } from './folders.service';

@Module({
  imports: [DatabaseModule, DocumentAuthModule, AuditLogsModule, DocumentActivitiesModule],
  controllers: [FoldersController],
  providers: [FoldersRepository, FoldersService],
  exports: [FoldersService, FoldersRepository],
})
export class FoldersModule {}
