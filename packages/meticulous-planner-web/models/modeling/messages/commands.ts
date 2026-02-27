import { TypeReference } from '../type-reference';
import {
  AttributeId,
  EnumerationItemId,
  Language,
  ModelId,
  ProjectId,
  ServiceId,
  ServiceType,
  Multiplicity,
  OperationId,
  OperationStereotype,
  ParameterId,
  SystemId,
  SystemType,
  Stereotype,
  TypeParameterId,
} from '../values';

export enum ModelingCommandType {
  // Project
  AddProject = 'add-project',
  RenameProject = 'rename-project',
  // System
  AddSystem = 'add-system',
  RenameSystem = 'rename-system',
  EditSystemType = 'edit-system-type',
  // Service
  AddService = 'add-service',
  RenameService = 'rename-service',
  EditServiceType = 'edit-service-type',
  // Model
  AddModel = 'add-model',
  RenameModel = 'rename-model',
  EditModelStereotype = 'edit-model-stereotype',
  EditModelGeneralizationType = 'edit-model-generalization-type',
  MoveModelToService = 'move-model-to-service',
  // Model - Attribute
  AddModelAttribute = 'add-model-attribute',
  RemoveModelAttribute = 'remove-model-attribute',
  RemoveAllModelAttributes = 'remove-all-model-attributes',
  RenameModelAttribute = 'rename-model-attribute',
  EditModelAttributeType = 'edit-model-attribute-type',
  EditModelAttributeMultiplicity = 'edit-model-attribute-multiplicity',
  // Model - Operation
  AddModelOperation = 'add-model-operation',
  RemoveModelOperation = 'remove-model-operation',
  RemoveAllModelOperations = 'remove-all-model-operations',
  RenameModelOperation = 'rename-model-operation',
  EditModelOperationReturnType = 'edit-model-operation-return-type',
  EditModelOperationMultiplicity = 'edit-model-operation-multiplicity',
  EditModelOperationStereotype = 'edit-model-operation-stereotype',
  // Model - Operation - Parameter
  AddModelOperationParameter = 'add-model-operation-parameter',
  RemoveModelOperationParameter = 'remove-model-operation-parameter',
  RemoveAllModelOperationParameters = 'remove-all-model-operation-parameters',
  RenameModelOperationParameter = 'rename-model-operation-parameter',
  EditModelOperationParameterType = 'edit-model-operation-parameter-type',
  EditModelOperationParameterMultiplicity = 'edit-model-operation-parameter-multiplicity',
  // Model - EnumerationItem
  AddModelEnumerationItem = 'add-model-enumeration-item',
  RemoveModelEnumerationItem = 'remove-model-enumeration-item',
  RemoveAllModelEnumerationItems = 'remove-all-model-enumeration-items',
  RenameModelEnumerationItem = 'rename-model-enumeration-item',
  EditModelEnumerationItemCode = 'edit-model-enumeration-item-code',
  // Model - TypeParameter
  AddModelTypeParameter = 'add-model-type-parameter',
  RemoveModelTypeParameter = 'remove-model-type-parameter',
  RemoveAllModelTypeParameters = 'remove-all-model-type-parameters',
  RenameModelTypeParameter = 'rename-model-type-parameter',
  EditModelTypeParameterConstraintType = 'edit-model-type-parameter-constraint-type',
}

// Project

export type AddProject = {
  readonly type: ModelingCommandType.AddProject;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly language: Language;
};

export type RenameProject = {
  readonly type: ModelingCommandType.RenameProject;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly language: Language;
};

// System

export type AddSystem = {
  readonly type: ModelingCommandType.AddSystem;
  readonly projectId: ProjectId | null;
  readonly name: string;
  readonly language: Language;
};

export type RenameSystem = {
  readonly type: ModelingCommandType.RenameSystem;
  readonly systemId: SystemId;
  readonly name: string;
  readonly language: Language;
};

export type EditSystemType = {
  readonly type: ModelingCommandType.EditSystemType;
  readonly systemId: SystemId;
  readonly systemType: SystemType;
};

// Service

export type AddService = {
  readonly type: ModelingCommandType.AddService;
  readonly systemId: SystemId;
  readonly name: string;
  readonly language: Language;
};

export type RenameService = {
  readonly type: ModelingCommandType.RenameService;
  readonly serviceId: ServiceId;
  readonly name: string;
  readonly language: Language;
};

export type EditServiceType = {
  readonly type: ModelingCommandType.EditServiceType;
  readonly serviceId: ServiceId;
  readonly serviceType: ServiceType;
};

// Model

export type AddModel = {
  readonly type: ModelingCommandType.AddModel;
  readonly systemId: SystemId;
  readonly serviceId: ServiceId;
  readonly name: string;
  readonly language: Language;
};

export type RenameModel = {
  readonly type: ModelingCommandType.RenameModel;
  readonly modelId: ModelId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelStereotype = {
  readonly type: ModelingCommandType.EditModelStereotype;
  readonly modelId: ModelId;
  readonly stereotype: Stereotype;
};

export type EditModelGeneralizationType = {
  readonly type: ModelingCommandType.EditModelGeneralizationType;
  readonly modelId: ModelId;
  readonly generalizationType: TypeReference | null;
};

export type MoveModelToService = {
  readonly type: ModelingCommandType.MoveModelToService;
  readonly modelId: ModelId;
  readonly serviceId: ServiceId | null;
};

// Model - Attribute

export type AddModelAttribute = {
  readonly type: ModelingCommandType.AddModelAttribute;
  readonly modelId: ModelId;
};

export type RemoveModelAttribute = {
  readonly type: ModelingCommandType.RemoveModelAttribute;
  readonly modelId: ModelId;
  readonly attributeId: AttributeId;
};

export type RemoveAllModelAttributes = {
  readonly type: ModelingCommandType.RemoveAllModelAttributes;
  readonly modelId: ModelId;
};

export type RenameModelAttribute = {
  readonly type: ModelingCommandType.RenameModelAttribute;
  readonly modelId: ModelId;
  readonly attributeId: AttributeId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelAttributeType = {
  readonly type: ModelingCommandType.EditModelAttributeType;
  readonly modelId: ModelId;
  readonly attributeId: AttributeId;
  readonly attributeType: TypeReference | null;
};

export type EditModelAttributeMultiplicity = {
  readonly type: ModelingCommandType.EditModelAttributeMultiplicity;
  readonly modelId: ModelId;
  readonly attributeId: AttributeId;
  readonly multiplicity: Multiplicity;
};

// Model - Operation

export type AddModelOperation = {
  readonly type: ModelingCommandType.AddModelOperation;
  readonly modelId: ModelId;
  readonly stereotype: OperationStereotype;
};

export type RemoveModelOperation = {
  readonly type: ModelingCommandType.RemoveModelOperation;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
};

export type RemoveAllModelOperations = {
  readonly type: ModelingCommandType.RemoveAllModelOperations;
  readonly modelId: ModelId;
  readonly stereotype: OperationStereotype;
};

export type EditModelOperationStereotype = {
  readonly type: ModelingCommandType.EditModelOperationStereotype;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly stereotype: OperationStereotype;
};

export type RenameModelOperation = {
  readonly type: ModelingCommandType.RenameModelOperation;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelOperationReturnType = {
  readonly type: ModelingCommandType.EditModelOperationReturnType;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly returnType: TypeReference | null;
};

export type EditModelOperationMultiplicity = {
  readonly type: ModelingCommandType.EditModelOperationMultiplicity;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly multiplicity: Multiplicity;
};

// Model - Operation - Parameter

export type AddModelOperationParameter = {
  readonly type: ModelingCommandType.AddModelOperationParameter;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
};

export type RemoveModelOperationParameter = {
  readonly type: ModelingCommandType.RemoveModelOperationParameter;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly parameterId: ParameterId;
};

export type RemoveAllModelOperationParameters = {
  readonly type: ModelingCommandType.RemoveAllModelOperationParameters;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
};

export type RenameModelOperationParameter = {
  readonly type: ModelingCommandType.RenameModelOperationParameter;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly parameterId: ParameterId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelOperationParameterType = {
  readonly type: ModelingCommandType.EditModelOperationParameterType;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly parameterId: ParameterId;
  readonly parameterType: TypeReference;
};

export type EditModelOperationParameterMultiplicity = {
  readonly type: ModelingCommandType.EditModelOperationParameterMultiplicity;
  readonly modelId: ModelId;
  readonly operationId: OperationId;
  readonly parameterId: ParameterId;
  readonly multiplicity: Multiplicity;
};

// Model - TypeParameter

export type AddModelTypeParameter = {
  readonly type: ModelingCommandType.AddModelTypeParameter;
  readonly modelId: ModelId;
};

export type RemoveModelTypeParameter = {
  readonly type: ModelingCommandType.RemoveModelTypeParameter;
  readonly modelId: ModelId;
  readonly typeParameterId: TypeParameterId;
};

export type RemoveAllModelTypeParameters = {
  readonly type: ModelingCommandType.RemoveAllModelTypeParameters;
  readonly modelId: ModelId;
};

export type RenameModelTypeParameter = {
  readonly type: ModelingCommandType.RenameModelTypeParameter;
  readonly modelId: ModelId;
  readonly typeParameterId: TypeParameterId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelTypeParameterConstraintType = {
  readonly type: ModelingCommandType.EditModelTypeParameterConstraintType;
  readonly modelId: ModelId;
  readonly typeParameterId: TypeParameterId;
  readonly constraintType: TypeReference | null;
};

// Model - EnumerationItem

export type AddModelEnumerationItem = {
  readonly type: ModelingCommandType.AddModelEnumerationItem;
  readonly modelId: ModelId;
};

export type RemoveModelEnumerationItem = {
  readonly type: ModelingCommandType.RemoveModelEnumerationItem;
  readonly modelId: ModelId;
  readonly enumerationItemId: EnumerationItemId;
};

export type RemoveAllModelEnumerationItems = {
  readonly type: ModelingCommandType.RemoveAllModelEnumerationItems;
  readonly modelId: ModelId;
};

export type RenameModelEnumerationItem = {
  readonly type: ModelingCommandType.RenameModelEnumerationItem;
  readonly modelId: ModelId;
  readonly enumerationItemId: EnumerationItemId;
  readonly name: string;
  readonly language: Language;
};

export type EditModelEnumerationItemCode = {
  readonly type: ModelingCommandType.EditModelEnumerationItemCode;
  readonly modelId: ModelId;
  readonly enumerationItemId: EnumerationItemId;
  readonly code: string;
};

export type ModelingCommand =
  | AddProject
  | RenameProject
  | EditSystemType
  | AddService
  | RenameService
  | EditServiceType
  | AddModel
  | RenameModel
  | EditModelStereotype
  | EditModelGeneralizationType
  | AddModelAttribute
  | RemoveModelAttribute
  | RemoveAllModelAttributes
  | RenameModelAttribute
  | EditModelAttributeType
  | EditModelAttributeMultiplicity
  | AddModelOperation
  | RemoveModelOperation
  | RemoveAllModelOperations
  | RenameModelOperation
  | EditModelOperationReturnType
  | EditModelOperationMultiplicity
  | EditModelOperationStereotype
  | AddModelOperationParameter
  | RemoveModelOperationParameter
  | RemoveAllModelOperationParameters
  | RenameModelOperationParameter
  | EditModelOperationParameterType
  | EditModelOperationParameterMultiplicity
  | AddModelTypeParameter
  | RemoveModelTypeParameter
  | RemoveAllModelTypeParameters
  | RenameModelTypeParameter
  | EditModelTypeParameterConstraintType
  | AddModelEnumerationItem
  | RemoveModelEnumerationItem
  | RemoveAllModelEnumerationItems
  | RenameModelEnumerationItem
  | EditModelEnumerationItemCode;
