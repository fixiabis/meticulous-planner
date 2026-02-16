import { Query } from '@/modules/base/models/records/values';
import { ProjectId } from '../records/values';

export enum ConceptQueryType {
  GetProjectTerms = 'concept:get-project-terms',
  GetProjectPolicies = 'concept:get-project-policies',
}

export class GetProjectTerms extends Query<ConceptQueryType.GetProjectTerms> {
  constructor(public readonly projectId: ProjectId) {
    super(ConceptQueryType.GetProjectTerms);
  }
}

export class GetProjectPolicies extends Query<ConceptQueryType.GetProjectPolicies> {
  constructor(public readonly projectId: ProjectId) {
    super(ConceptQueryType.GetProjectPolicies);
  }
}
