import { ProjectId } from '../../project/models/values';

export enum ModelingQueryType {
  GetProjectModels = 'get-project-models',
}

export type GetProjectModels = {
  type: ModelingQueryType.GetProjectModels;
  projectId: ProjectId;
};
