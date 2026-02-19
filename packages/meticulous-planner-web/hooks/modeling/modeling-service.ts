import { buildBaseModels } from '@/models/modeling/base';
import { Description } from '@/models/modeling/description';
import {
  AddModel,
  AddModelAttribute,
  AddModelOperation,
  AddModelOperationParameter,
  AddModelTypeParameter,
  AddModule,
  EditModelAttributeMultiplicity,
  EditModelAttributeType,
  EditModelGeneralizationType,
  EditModelOperationMultiplicity,
  EditModelOperationParameterMultiplicity,
  EditModelOperationParameterType,
  EditModelOperationReturnType,
  EditModelStereotype,
  EditModelTypeParameterConstraintType,
  RemoveAllModelAttributes,
  RemoveAllModelOperationParameters,
  RemoveAllModelOperations,
  RemoveAllModelTypeParameters,
  RemoveModelAttribute,
  RemoveModelOperation,
  RemoveModelOperationParameter,
  RemoveModelTypeParameter,
  RenameModel,
  RenameModelAttribute,
  RenameModelOperation,
  RenameModelOperationParameter,
  RenameModelTypeParameter,
  RenameModule,
} from '@/models/modeling/messages/commands';
import { GetModel, GetProjectModels, GetProjectModules } from '@/models/modeling/messages/queries';
import { Model } from '@/models/modeling/model';
import { Module } from '@/models/modeling/module';
import { ModelId, ModuleId } from '@/models/modeling/values';
import { create } from 'zustand';

export interface ModelingService {
  getProjectModels(query: GetProjectModels): Promise<Model[]>;
  getProjectModules(query: GetProjectModules): Promise<Module[]>;
  getModel(query: GetModel): Promise<Model>;
  // Module
  addModule(command: AddModule): Promise<Module>;
  renameModule(command: RenameModule): Promise<Module>;
  // Model
  addModel(command: AddModel): Promise<Model>;
  renameModel(command: RenameModel): Promise<Model>;
  editModelStereotype(command: EditModelStereotype): Promise<Model>;
  editModelGeneralizationType(command: EditModelGeneralizationType): Promise<Model>;
  // Model - Attribute
  addModelAttribute(command: AddModelAttribute): Promise<Model>;
  removeModelAttribute(command: RemoveModelAttribute): Promise<Model>;
  removeAllModelAttributes(command: RemoveAllModelAttributes): Promise<Model>;
  renameModelAttribute(command: RenameModelAttribute): Promise<Model>;
  editModelAttributeType(command: EditModelAttributeType): Promise<Model>;
  editModelAttributeMultiplicity(command: EditModelAttributeMultiplicity): Promise<Model>;
  // Model - Operation
  addModelOperation(command: AddModelOperation): Promise<Model>;
  removeModelOperation(command: RemoveModelOperation): Promise<Model>;
  removeAllModelOperations(command: RemoveAllModelOperations): Promise<Model>;
  renameModelOperation(command: RenameModelOperation): Promise<Model>;
  editModelOperationReturnType(command: EditModelOperationReturnType): Promise<Model>;
  editModelOperationMultiplicity(command: EditModelOperationMultiplicity): Promise<Model>;
  // Model - Operation - Parameter
  addModelOperationParameter(command: AddModelOperationParameter): Promise<Model>;
  removeModelOperationParameter(command: RemoveModelOperationParameter): Promise<Model>;
  removeAllModelOperationParameters(command: RemoveAllModelOperationParameters): Promise<Model>;
  renameModelOperationParameter(command: RenameModelOperationParameter): Promise<Model>;
  editModelOperationParameterType(command: EditModelOperationParameterType): Promise<Model>;
  editModelOperationParameterMultiplicity(command: EditModelOperationParameterMultiplicity): Promise<Model>;
  // Model - TypeParameter
  addModelTypeParameter(command: AddModelTypeParameter): Promise<Model>;
  removeModelTypeParameter(command: RemoveModelTypeParameter): Promise<Model>;
  removeAllModelTypeParameters(command: RemoveAllModelTypeParameters): Promise<Model>;
  renameModelTypeParameter(command: RenameModelTypeParameter): Promise<Model>;
  editModelTypeParameterConstraintType(command: EditModelTypeParameterConstraintType): Promise<Model>;
}

export type ModelingStore = ModelingService & {
  models: Model[];
  modules: Module[];
};

const useModelingStore = create<ModelingStore>((set, get) => ({
  models: [],
  modules: [],

  async getProjectModels(query) {
    return get()
      .models.filter((model) => model.projectId === query.projectId)
      .concat(buildBaseModels(query.projectId));
  },

  async getProjectModules(query) {
    return get()
      .modules.filter((module) => module.projectId === query.projectId)
      .concat([Module.create({ id: ModuleId('base'), projectId: query.projectId, isBase: true })]);
  },

  async getModel(query) {
    const model = get().models.find((model) => model.id === query.modelId);

    if (!model) {
      throw new Error('Model not found');
    }

    return model;
  },

  // Module

  async addModule(command) {
    const newModule = Module.create({
      id: ModuleId(crypto.randomUUID()),
      projectId: command.projectId,
      descriptions: {
        [command.language]: Description.create({ name: command.name, language: command.language }),
      },
    });

    set({ modules: [...get().modules, newModule] });

    return newModule;
  },

  async renameModule(command) {
    const modules = get().modules;
    const found = modules.find((m) => m.id === command.moduleId);

    if (!found) {
      throw new Error('Module not found');
    }

    const updated = found.rename(command.name, command.language);
    set({ modules: modules.map((m) => (m.id === command.moduleId ? updated : m)) });

    return updated;
  },

  // Model

  async addModel(command) {
    const model = Model.create({
      id: ModelId(crypto.randomUUID()),
      projectId: command.projectId,
      moduleId: command.moduleId,
      descriptions: {
        [command.language]: Description.create({
          name: command.name,
          language: command.language,
        }),
      },
    });

    set({ models: [...get().models, model] });

    return model;
  },

  async renameModel(command) {
    return updateModel(get, set, command.modelId, (m) => m.rename(command.name, command.language));
  },

  async editModelStereotype(command) {
    return updateModel(get, set, command.modelId, (m) => m.editStereotype(command.stereotype));
  },

  async editModelGeneralizationType(command) {
    return updateModel(get, set, command.modelId, (m) => m.editGeneralizationType(command.generalizationType));
  },

  // Model - Attribute

  async addModelAttribute(command) {
    return updateModel(get, set, command.modelId, (m) => m.addAttribute(command.attributeId));
  },

  async removeModelAttribute(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeAttribute(command.attributeId));
  },

  async removeAllModelAttributes(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeAllAttributes());
  },

  async renameModelAttribute(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.renameAttribute(command.attributeId, command.name, command.language),
    );
  },

  async editModelAttributeType(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editAttributeType(command.attributeId, command.attributeType),
    );
  },

  async editModelAttributeMultiplicity(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editAttributeMultiplicity(command.attributeId, command.multiplicity),
    );
  },

  // Model - Operation

  async addModelOperation(command) {
    return updateModel(get, set, command.modelId, (m) => m.addOperation(command.operationId));
  },

  async removeModelOperation(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeOperation(command.operationId));
  },

  async removeAllModelOperations(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeAllOperation());
  },

  async renameModelOperation(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.renameOperation(command.operationId, command.name, command.language),
    );
  },

  async editModelOperationReturnType(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editOperationReturnType(command.operationId, command.returnType),
    );
  },

  async editModelOperationMultiplicity(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editOperationMultiplicity(command.operationId, command.multiplicity),
    );
  },

  // Model - Operation - Parameter

  async addModelOperationParameter(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.addOperationParameter(command.operationId, command.parameterId),
    );
  },

  async removeModelOperationParameter(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.removeOperationParameter(command.operationId, command.parameterId),
    );
  },

  async removeAllModelOperationParameters(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeOperationAllParameters(command.operationId));
  },

  async renameModelOperationParameter(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.renameOperationParameter(command.operationId, command.parameterId, command.name, command.language),
    );
  },

  async editModelOperationParameterType(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editOperationParameterType(command.operationId, command.parameterId, command.parameterType),
    );
  },

  async editModelOperationParameterMultiplicity(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editOperationParameterMultiplicity(command.operationId, command.parameterId, command.multiplicity),
    );
  },

  // Model - TypeParameter

  async addModelTypeParameter(command) {
    return updateModel(get, set, command.modelId, (m) => m.addTypeParameter(command.typeParameterId));
  },

  async removeModelTypeParameter(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeTypeParameters(command.typeParameterId));
  },

  async removeAllModelTypeParameters(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeAllTypeParameters());
  },

  async renameModelTypeParameter(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.renameTypeParameter(command.typeParameterId, command.name, command.language),
    );
  },

  async editModelTypeParameterConstraintType(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editTypeParameterConstraintType(command.typeParameterId, command.constraintType),
    );
  },
}));

function updateModel(
  get: () => ModelingStore,
  set: (partial: Partial<ModelingStore>) => void,
  modelId: ModelId,
  edit: (model: Model) => Model,
): Model {
  const models = get().models;
  const model = models.find((m) => m.id === modelId);

  if (!model) {
    throw new Error('Model not found');
  }

  const updated = edit(model);
  set({ models: models.map((m) => (m.id === modelId ? updated : m)) });

  return updated;
}

export function useModelingService(): ModelingService {
  const modelingStore = useModelingStore();

  return modelingStore;
}
