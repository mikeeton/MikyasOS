import { Module, forwardRef } from '@nestjs/common';

import { DocumentAuthModule } from '../common/document-auth.module';
import { DocumentsModule } from '../documents.module';
import { DocumentSearchController } from './document-search.controller';

@Module({
  imports: [DocumentAuthModule, forwardRef(() => DocumentsModule)],
  controllers: [DocumentSearchController],
})
export class DocumentSearchModule {}
