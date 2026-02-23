import { buildBaseModels, buildBaseService } from '@/models/modeling/base';
import { Description } from '@/models/modeling/description';
import {
  AddModel,
  AddModelAttribute,
  AddModelEnumerationItem,
  AddModelOperation,
  AddModelOperationParameter,
  AddModelTypeParameter,
  AddService,
  AddSystem,
  EditModelAttributeMultiplicity,
  EditModelAttributeType,
  EditModelEnumerationItemCode,
  EditModelGeneralizationType,
  EditModelOperationMultiplicity,
  EditModelOperationParameterMultiplicity,
  EditModelOperationParameterType,
  EditModelOperationReturnType,
  EditModelStereotype,
  EditModelTypeParameterConstraintType,
  MoveModelToService,
  RemoveAllModelAttributes,
  RemoveAllModelEnumerationItems,
  RemoveAllModelOperationParameters,
  RemoveAllModelOperations,
  RemoveAllModelTypeParameters,
  RemoveModelAttribute,
  RemoveModelEnumerationItem,
  RemoveModelOperation,
  RemoveModelOperationParameter,
  RemoveModelTypeParameter,
  RenameModel,
  RenameModelAttribute,
  RenameModelEnumerationItem,
  RenameModelOperation,
  RenameModelOperationParameter,
  RenameModelTypeParameter,
  RenameService,
  RenameSystem,
} from '@/models/modeling/messages/commands';
import { GetModel, GetSystemModels, GetSystems, GetSystemServices } from '@/models/modeling/messages/queries';
import { Model } from '@/models/modeling/model';
import { Service } from '@/models/modeling/service';
import { System } from '@/models/modeling/system';
import {
  AttributeId,
  EnumerationItemId,
  ModelId,
  OperationId,
  ParameterId,
  ServiceId,
  SystemId,
  TypeParameterId,
} from '@/models/modeling/values';
import { create } from 'zustand';

export interface ModelingService {
  getSystems(query: GetSystems): Promise<System[]>;
  getSystemModels(query: GetSystemModels): Promise<Model[]>;
  getSystemServices(query: GetSystemServices): Promise<Service[]>;
  getModel(query: GetModel): Promise<Model>;
  addSystem(command: AddSystem): Promise<System>;
  renameSystem(command: RenameSystem): Promise<System>;
  // Service
  addService(command: AddService): Promise<Service>;
  renameService(command: RenameService): Promise<Service>;
  // Model
  addModel(command: AddModel): Promise<Model>;
  renameModel(command: RenameModel): Promise<Model>;
  editModelStereotype(command: EditModelStereotype): Promise<Model>;
  editModelGeneralizationType(command: EditModelGeneralizationType): Promise<Model>;
  moveModelToService(command: MoveModelToService): Promise<Model>;
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
  // Model - EnumerationItem
  addModelEnumerationItem(command: AddModelEnumerationItem): Promise<Model>;
  removeModelEnumerationItem(command: RemoveModelEnumerationItem): Promise<Model>;
  removeAllModelEnumerationItems(command: RemoveAllModelEnumerationItems): Promise<Model>;
  renameModelEnumerationItem(command: RenameModelEnumerationItem): Promise<Model>;
  editModelEnumerationItemCode(command: EditModelEnumerationItemCode): Promise<Model>;
}

export type ModelingStore = ModelingService & {
  systems: System[];
  services: Service[];
  models: Model[];
};

const useModelingStore = create<ModelingStore>((set, get) => ({
  systems: [],
  services: [],
  models: [
    Model.create({
      id: ModelId('sample'),
      systemId: SystemId('sample'),
    }),
  ],

  async getSystems() {
    return get().systems;
  },

  async getSystemModels(query) {
    return get()
      .models.filter((model) => model.systemId === query.systemId)
      .concat(buildBaseModels(query.systemId));
  },

  async getSystemServices(query) {
    return get()
      .services.filter((service) => service.systemId === query.systemId)
      .concat(buildBaseService(query.systemId));
  },

  async getModel(query) {
    const baseModels = buildBaseModels(SystemId('unknown'));

    const model = get()
      .models.concat(baseModels)
      .find((model) => model.id === query.modelId);

    if (!model) {
      throw new Error('Model not found');
    }

    return model;
  },

  // System

  async addSystem(command) {
    const newSystem = System.create({
      id: SystemId(crypto.randomUUID()),
      descriptions: {
        [command.language]: Description.create({ name: command.name, language: command.language }),
      },
    });

    set({ systems: [...get().systems, newSystem] });

    return newSystem;
  },

  async renameSystem(command) {
    const systems = get().systems;
    const found = systems.find((m) => m.id === command.systemId);

    if (!found) {
      throw new Error('System not found');
    }

    const updated = found.rename(command.name, command.language);
    set({ systems: systems.map((m) => (m.id === command.systemId ? updated : m)) });

    return updated;
  },

  // Service

  async addService(command) {
    const newService = Service.create({
      id: ServiceId(crypto.randomUUID()),
      systemId: command.systemId,
      descriptions: {
        [command.language]: Description.create({ name: command.name, language: command.language }),
      },
    });

    set({ services: [...get().services, newService] });

    return newService;
  },

  async renameService(command) {
    const services = get().services;
    const found = services.find((m) => m.id === command.serviceId);

    if (!found) {
      throw new Error('Service not found');
    }

    const updated = found.rename(command.name, command.language);
    set({ services: services.map((m) => (m.id === command.serviceId ? updated : m)) });

    return updated;
  },

  // Model

  async addModel(command) {
    const model = Model.create({
      id: ModelId(crypto.randomUUID()),
      systemId: command.systemId,
      serviceId: command.serviceId,
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

  async moveModelToService(command) {
    return updateModel(get, set, command.modelId, (m) => m.moveToService(command.serviceId));
  },

  // Model - Attribute

  async addModelAttribute(command) {
    return updateModel(get, set, command.modelId, (m) => m.addAttribute(AttributeId(crypto.randomUUID())));
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
    return updateModel(get, set, command.modelId, (m) => m.addOperation(OperationId(crypto.randomUUID())));
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
      m.addOperationParameter(command.operationId, ParameterId(crypto.randomUUID())),
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
    return updateModel(get, set, command.modelId, (m) => m.addTypeParameter(TypeParameterId(crypto.randomUUID())));
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

  // Model - EnumerationItem

  async addModelEnumerationItem(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.addEnumerationItem(EnumerationItemId(crypto.randomUUID())),
    );
  },

  async removeModelEnumerationItem(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeEnumerationItem(command.enumerationItemId));
  },

  async removeAllModelEnumerationItems(command) {
    return updateModel(get, set, command.modelId, (m) => m.removeAllEnumerationItems());
  },

  async renameModelEnumerationItem(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.renameEnumerationItem(command.enumerationItemId, command.name, command.language),
    );
  },

  async editModelEnumerationItemCode(command) {
    return updateModel(get, set, command.modelId, (m) =>
      m.editEnumerationItemCode(command.enumerationItemId, command.code),
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
