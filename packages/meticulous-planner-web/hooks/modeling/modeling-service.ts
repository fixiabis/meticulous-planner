import { buildBaseModels, buildBaseService } from '@/models/modeling/base';
import { Attribute } from '@/models/modeling/attribute';
import { Description } from '@/models/modeling/description';
import { EnumerationItem } from '@/models/modeling/enumeration-item';
import {
  AddModel,
  AddModelAttribute,
  AddModelEnumerationItem,
  AddModelOperation,
  AddModelOperationParameter,
  AddModelTypeParameter,
  AddProject,
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
  EditModelOperationStereotype,
  EditModelStereotype,
  EditModelTypeParameterConstraintType,
  EditServiceType,
  EditSystemType,
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
  RenameProject,
  RenameService,
  RenameSystem,
} from '@/models/modeling/messages/commands';
import {
  GetModel,
  GetProjectSystems,
  GetProjects,
  GetSystemModels,
  GetSystems,
  GetSystemServices,
} from '@/models/modeling/messages/queries';
import { Model } from '@/models/modeling/model';
import { Operation } from '@/models/modeling/operation';
import { Parameter } from '@/models/modeling/parameter';
import { Project } from '@/models/modeling/project';
import { Service } from '@/models/modeling/service';
import { System } from '@/models/modeling/system';
import { TypeParameter } from '@/models/modeling/type-parameter';
import { TypeReference } from '@/models/modeling/type-reference';
import {
  AttributeId,
  EnumerationItemId,
  Language,
  ModelId,
  OperationId,
  OperationStereotype,
  ParameterId,
  ProjectId,
  ServiceId,
  SystemId,
  TypeParameterId,
} from '@/models/modeling/values';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Revive helpers ─────────────────────────────────────────────────────────────
// When data is deserialized from localStorage it becomes plain objects.
// These functions reconstruct the class instances so their methods work.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any;

function reviveDescriptions(raw: Raw): Readonly<Partial<Record<Language, Description>>> {
  if (!raw) return {};
  return Object.fromEntries(
    Object.entries(raw).map(([k, v]: [string, Raw]) => [k, new Description({ name: v.name, language: v.language })]),
  );
}

function reviveTypeReference(raw: Raw): TypeReference {
  const typeArguments: Record<string, TypeReference> = {};
  for (const [k, v] of Object.entries(raw.typeArguments ?? {})) {
    typeArguments[k] = reviveTypeReference(v);
  }
  return new TypeReference({
    type: raw.type,
    modelId: raw.modelId ?? null,
    typeParameterId: raw.typeParameterId ?? null,
    typeArguments,
  });
}

function reviveAttribute(raw: Raw): Attribute {
  return new Attribute({
    id: raw.id,
    type: raw.type ? reviveTypeReference(raw.type) : null,
    multiplicity: raw.multiplicity,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveParameter(raw: Raw): Parameter {
  return new Parameter({
    id: raw.id,
    type: raw.type ? reviveTypeReference(raw.type) : null,
    multiplicity: raw.multiplicity,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveOperation(raw: Raw): Operation {
  return new Operation({
    id: raw.id,
    stereotype: raw.stereotype ?? OperationStereotype.Command,
    parameters: (raw.parameters ?? []).map(reviveParameter),
    returnType: raw.returnType ? reviveTypeReference(raw.returnType) : null,
    returnMultiplicity: raw.returnMultiplicity,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveTypeParameter(raw: Raw): TypeParameter {
  return new TypeParameter({
    id: raw.id,
    constraintType: raw.constraintType ? reviveTypeReference(raw.constraintType) : null,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveEnumerationItem(raw: Raw): EnumerationItem {
  return new EnumerationItem({
    id: raw.id,
    code: raw.code ?? '',
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveProject(raw: Raw): Project {
  return new Project({
    id: raw.id,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveModel(raw: Raw): Model {
  return new Model({
    id: raw.id,
    projectId: raw.projectId ?? null,
    systemId: raw.systemId,
    serviceId: raw.serviceId ?? null,
    stereotype: raw.stereotype,
    generalizationType: raw.generalizationType ? reviveTypeReference(raw.generalizationType) : null,
    attributes: (raw.attributes ?? []).map(reviveAttribute),
    operations: (raw.operations ?? []).map(reviveOperation),
    typeParameters: (raw.typeParameters ?? []).map(reviveTypeParameter),
    enumerationItems: (raw.enumerationItems ?? []).map(reviveEnumerationItem),
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveService(raw: Raw): Service {
  return new Service({
    id: raw.id,
    projectId: raw.projectId ?? null,
    systemId: raw.systemId,
    isBase: raw.isBase ?? false,
    serviceType: raw.serviceType,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

function reviveSystem(raw: Raw): System {
  return new System({
    id: raw.id,
    projectId: raw.projectId ?? null,
    systemType: raw.systemType,
    descriptions: reviveDescriptions(raw.descriptions),
  });
}

// ── Persist storage ────────────────────────────────────────────────────────────

type PersistedState = { projects: Raw[]; systems: Raw[]; services: Raw[]; models: Raw[] };

const modelingStorage = {
  getItem: (name: string): { state: PersistedState; version?: number } | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const { state, version } = JSON.parse(raw);
      return {
        state: {
          projects: (state.projects ?? []).map(reviveProject),
          systems: (state.systems ?? []).map(reviveSystem),
          services: (state.services ?? []).map(reviveService),
          models: (state.models ?? []).map(reviveModel),
        },
        version,
      };
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

// ── Store ──────────────────────────────────────────────────────────────────────

export interface ModelingService {
  // Project
  getProjects(query: GetProjects): Promise<Project[]>;
  getProjectSystems(query: GetProjectSystems): Promise<System[]>;
  addProject(command: AddProject): Promise<Project>;
  renameProject(command: RenameProject): Promise<Project>;
  // System
  getSystems(query: GetSystems): Promise<System[]>;
  getSystemModels(query: GetSystemModels): Promise<Model[]>;
  getSystemServices(query: GetSystemServices): Promise<Service[]>;
  getModel(query: GetModel): Promise<Model>;
  addSystem(command: AddSystem): Promise<System>;
  renameSystem(command: RenameSystem): Promise<System>;
  editSystemType(command: EditSystemType): Promise<System>;
  // Service
  addService(command: AddService): Promise<Service>;
  renameService(command: RenameService): Promise<Service>;
  editServiceType(command: EditServiceType): Promise<Service>;
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
  editModelOperationStereotype(command: EditModelOperationStereotype): Promise<Model>;
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
  projects: Project[];
  systems: System[];
  services: Service[];
  models: Model[];
};

const useModelingStore = create<ModelingStore>()(
  persist(
    (set, get) => ({
      projects: [],
      systems: [],
      services: [],
      models: [],

      async getProjects() {
        return get().projects;
      },

      async getProjectSystems(query) {
        return get().systems.filter((s) => s.projectId === query.projectId);
      },

      async addProject(command) {
        const newProject = Project.create({
          id: command.projectId,
          descriptions: {
            [command.language]: Description.create({ name: command.name, language: command.language }),
          },
        });
        set({ projects: [...get().projects, newProject] });
        return newProject;
      },

      async renameProject(command) {
        const projects = get().projects;
        const found = projects.find((p) => p.id === command.projectId);
        if (!found) throw new Error('Project not found');
        const updated = found.rename(command.name, command.language);
        set({ projects: projects.map((p) => (p.id === command.projectId ? updated : p)) });
        return updated;
      },

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
          projectId: command.projectId ?? null,
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

      async editSystemType(command) {
        const systems = get().systems;
        const found = systems.find((m) => m.id === command.systemId);

        if (!found) {
          throw new Error('System not found');
        }

        const updated = found.editSystemType(command.systemType);
        set({ systems: systems.map((m) => (m.id === command.systemId ? updated : m)) });

        return updated;
      },

      // Service

      async addService(command) {
        const system = get().systems.find((s) => s.id === command.systemId);
        const newService = Service.create({
          id: ServiceId(crypto.randomUUID()),
          projectId: system?.projectId ?? null,
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

      async editServiceType(command) {
        const services = get().services;
        const found = services.find((m) => m.id === command.serviceId);

        if (!found) {
          throw new Error('Service not found');
        }

        const updated = found.editServiceType(command.serviceType);
        set({ services: services.map((m) => (m.id === command.serviceId ? updated : m)) });

        return updated;
      },

      // Model

      async addModel(command) {
        const system = get().systems.find((s) => s.id === command.systemId);
        const model = Model.create({
          id: ModelId(crypto.randomUUID()),
          projectId: system?.projectId ?? null,
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
        return updateModel(get, set, command.modelId, (m) =>
          m.addOperation(OperationId(crypto.randomUUID()), command.stereotype),
        );
      },

      async removeModelOperation(command) {
        return updateModel(get, set, command.modelId, (m) => m.removeOperation(command.operationId));
      },

      async removeAllModelOperations(command) {
        return updateModel(get, set, command.modelId, (m) => m.removeAllOperationsByStereotype(command.stereotype));
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

      async editModelOperationStereotype(command) {
        return updateModel(get, set, command.modelId, (m) =>
          m.editOperationStereotype(command.operationId, command.stereotype),
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
    }),
    {
      name: 'meticulous-planner-modeling',
      storage: modelingStorage,
      partialize: (state) => ({
        projects: state.projects,
        systems: state.systems,
        services: state.services,
        models: state.models,
      }),
    },
  ),
);

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
