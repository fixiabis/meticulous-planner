import { ModelId, SystemId } from '../values';

export enum ModelingQueryType {
  GetSystems = 'get-systems',
  GetSystemModels = 'get-system-models',
  GetSystemServices = 'get-system-services',
  GetModel = 'get-model',
}

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
