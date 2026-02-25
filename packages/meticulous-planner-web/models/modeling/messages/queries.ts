import { ModelId, ProjectId, SystemId } from '../values';

export enum ModelingQueryType {
  GetProjects = 'get-projects',
  GetProjectSystems = 'get-project-systems',
  GetSystems = 'get-systems',
  GetSystemModels = 'get-system-models',
  GetSystemServices = 'get-system-services',
  GetModel = 'get-model',
}

export type GetProjects = {
  type: ModelingQueryType.GetProjects;
};

export type GetProjectSystems = {
  type: ModelingQueryType.GetProjectSystems;
  projectId: ProjectId;
};

export type GetSystems = {
  type: ModelingQueryType.GetSystems;
};

export type GetSystemModels = {
  type: ModelingQueryType.GetSystemModels;
  systemId: SystemId;
};

export type GetSystemServices = {
  type: ModelingQueryType.GetSystemServices;
  systemId: SystemId;
};

export type GetModel = {
  type: ModelingQueryType.GetModel;
  modelId: ModelId;
};
