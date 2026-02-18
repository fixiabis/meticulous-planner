import { Model } from '@/models/modeling/model';
import { Module } from '@/models/modeling/module';
import { ModelId, ProjectId } from '@/models/modeling/values';
import { create } from 'zustand';

export interface ModelingService {
  getProjectModels(projectId: ProjectId): Promise<Model[]>;
  findModel(id: ModelId): Promise<Model | null>;
}

export type ModelingStore = ModelingService & {
  models: Model[];
  modules: Module[];
};

const useModelingStore = create<ModelingStore>((set, get) => ({
  models: [],
  modules: [],

  async getProjectModels(projectId: ProjectId): Promise<Model[]> {
    return get().models.filter((model) => model.projectId === projectId);
  },

  async findModel(id: ModelId): Promise<Model | null> {
    return get().models.find((model) => model.id === id) || null;
  },
}));

export function useModelingService(): ModelingService {
  const modelingStore = useModelingStore();

  return modelingStore;
}
