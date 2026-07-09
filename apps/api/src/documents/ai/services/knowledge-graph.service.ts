import { Injectable } from '@nestjs/common';

@Injectable()
export class KnowledgeGraphService {
  getGraphArchitecture() {
    return {
      enabled: false,
      traversableEntities: [
        'Document',
        'Folder',
        'CRM Company',
        'CRM Contact',
        'Project',
        'Task',
        'Employee',
        'Meeting',
        'Invoice',
        'Policy',
        'AI Memory',
      ],
      relationshipTraversalPrepared: true,
      graphUpdatesQueued: true,
    };
  }
}
