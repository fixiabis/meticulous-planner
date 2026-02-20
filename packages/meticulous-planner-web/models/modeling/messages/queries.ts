import { ModelId, SystemId } from '../values';

export enum ModelingQueryType {
  GetSystemModels = 'get-system-models',
  GetSystemServices = 'get-system-services',
  GetModel = 'get-model',
}

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
