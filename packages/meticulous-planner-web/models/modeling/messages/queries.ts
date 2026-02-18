import { ModelId, ProjectId } from '../values';

export enum ModelingQueryType {
  GetProjectModels = 'get-project-models',
  GetProjectModules = 'get-project-modules',
  GetModel = 'get-model',
}

export type GetProjectModels = {
  type: ModelingQueryType.GetProjectModels;
  projectId: ProjectId;
};

export type GetProjectModules = {
  type: ModelingQueryType.GetProjectModules;
  projectId: ProjectId;
};

export type GetModel = {
  type: ModelingQueryType.GetModel;
  modelId: ModelId;
};
