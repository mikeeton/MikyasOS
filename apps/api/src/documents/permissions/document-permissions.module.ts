import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infra/database/database.module';
import { DocumentPermissionsService } from './document-permissions.service';

@Module({
  imports: [DatabaseModule],
  providers: [DocumentPermissionsService],
  exports: [DocumentPermissionsService],
})
export class DocumentPermissionsModule {}
