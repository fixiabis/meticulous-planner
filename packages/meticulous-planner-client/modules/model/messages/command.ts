import { TypeReference } from '../models/type-reference';
import {
  AttributeId,
  EnumerationItemId,
  ExpressionLanguage,
  ModelId,
  ModelStereotype,
  Multiplicity,
  OperationId,
  ParameterId,
  TypeParameterId,
} from '../models/values';
import { ProjectId } from '../../project/models/values';

export enum ModelingCommandType {
  CreateModel = 'create-model',
  EditModelName = 'edit-model-name',
  EditModelTemplateType = 'edit-model-template-type',

  AddAttribute = 'add-attribute',
  RemoveAttribute = 'remove-attribute',
  EditAttributeName = 'edit-attribute-name',
  EditAttributeType = 'edit-attribute-type',
  EditAttributeMultiplicity = 'edit-attribute-multiplicity',

  AddOperation = 'add-operation',
  RemoveOperation = 'remove-operation',
  EditOperationName = 'edit-operation-name',
  EditOperationReturnType = 'edit-operation-return-type',
  EditOperationReturnMultiplicity = 'edit-operation-return-multiplicity',
  AddOperationParameter = 'add-operation-parameter',
  RemoveOperationParameter = 'remove-operation-parameter',
  EditOperationParameterName = 'edit-operation-parameter-name',
  EditOperationParameterType = 'edit-operation-parameter-type',
  EditOperationParameterMultiplicity = 'edit-operation-parameter-multiplicity',

  AddEnumerationItem = 'add-enumeration-item',
  RemoveEnumerationItem = 'remove-enumeration-item',
  EditEnumerationItemName = 'edit-enumeration-item-name',
  EditEnumerationItemCode = 'edit-enumeration-item-code',

  AddTypeParameter = 'add-type-parameter',
  RemoveTypeParameter = 'remove-type-parameter',
  EditTypeParameterName = 'edit-type-parameter-name',
  EditTypeParameterType = 'edit-type-parameter-type',
}

export type CreateModel = {
  type: ModelingCommandType.CreateModel;
  projectId: ProjectId;
  stereotype: ModelStereotype;
};

export type EditModelName = {
  type: ModelingCommandType.EditModelName;
  modelId: ModelId;
  language: ExpressionLanguage;
  name: string;
};

export type EditModelTemplateType = {
  type: ModelingCommandType.EditModelTemplateType;
  modelId: ModelId;
  templateType: TypeReference;
};

// Attribute commands

export type AddAttribute = {
  type: ModelingCommandType.AddAttribute;
  modelId: ModelId;
};

export type RemoveAttribute = {
  type: ModelingCommandType.RemoveAttribute;
  modelId: ModelId;
  attributeId: AttributeId;
};

export type EditAttributeName = {
  type: ModelingCommandType.EditAttributeName;
  modelId: ModelId;
  attributeId: AttributeId;
  language: ExpressionLanguage;
  name: string;
};

export type EditAttributeType = {
  type: ModelingCommandType.EditAttributeType;
  modelId: ModelId;
  attributeId: AttributeId;
  typeReference: TypeReference;
};

export type EditAttributeMultiplicity = {
  type: ModelingCommandType.EditAttributeMultiplicity;
  modelId: ModelId;
  attributeId: AttributeId;
  multiplicity: Multiplicity;
};

// Operation commands

export type AddOperation = {
  type: ModelingCommandType.AddOperation;
  modelId: ModelId;
};

export type RemoveOperation = {
  type: ModelingCommandType.RemoveOperation;
  modelId: ModelId;
  operationId: OperationId;
};

export type EditOperationName = {
  type: ModelingCommandType.EditOperationName;
  modelId: ModelId;
  operationId: OperationId;
  language: ExpressionLanguage;
  name: string;
};

export type EditOperationReturnType = {
  type: ModelingCommandType.EditOperationReturnType;
  modelId: ModelId;
  operationId: OperationId;
  returnType: TypeReference;
};

export type EditOperationReturnMultiplicity = {
  type: ModelingCommandType.EditOperationReturnMultiplicity;
  modelId: ModelId;
  operationId: OperationId;
  returnMultiplicity: Multiplicity;
};

export type AddOperationParameter = {
  type: ModelingCommandType.AddOperationParameter;
  modelId: ModelId;
  operationId: OperationId;
};

export type RemoveOperationParameter = {
  type: ModelingCommandType.RemoveOperationParameter;
  modelId: ModelId;
  operationId: OperationId;
  parameterId: ParameterId;
};

export type EditOperationParameterName = {
  type: ModelingCommandType.EditOperationParameterName;
  modelId: ModelId;
  operationId: OperationId;
  parameterId: ParameterId;
  language: ExpressionLanguage;
  name: string;
};

export type EditOperationParameterType = {
  type: ModelingCommandType.EditOperationParameterType;
  modelId: ModelId;
  operationId: OperationId;
  parameterId: ParameterId;
  typeReference: TypeReference;
};

export type EditOperationParameterMultiplicity = {
  type: ModelingCommandType.EditOperationParameterMultiplicity;
  modelId: ModelId;
  operationId: OperationId;
  parameterId: ParameterId;
  multiplicity: Multiplicity;
};

// Enumeration item commands

export type AddEnumerationItem = {
  type: ModelingCommandType.AddEnumerationItem;
  modelId: ModelId;
};

export type RemoveEnumerationItem = {
  type: ModelingCommandType.RemoveEnumerationItem;
  modelId: ModelId;
  enumerationItemId: EnumerationItemId;
};

export type EditEnumerationItemName = {
  type: ModelingCommandType.EditEnumerationItemName;
  modelId: ModelId;
  enumerationItemId: EnumerationItemId;
  language: ExpressionLanguage;
  name: string;
};

export type EditEnumerationItemCode = {
  type: ModelingCommandType.EditEnumerationItemCode;
  modelId: ModelId;
  enumerationItemId: EnumerationItemId;
  code: string;
};

// Type parameter commands

export type AddTypeParameter = {
  type: ModelingCommandType.AddTypeParameter;
  modelId: ModelId;
};

export type RemoveTypeParameter = {
  type: ModelingCommandType.RemoveTypeParameter;
  modelId: ModelId;
  typeParameterId: TypeParameterId;
};

export type EditTypeParameterName = {
  type: ModelingCommandType.EditTypeParameterName;
  modelId: ModelId;
  typeParameterId: TypeParameterId;
  language: ExpressionLanguage;
  name: string;
};

export type EditTypeParameterType = {
  type: ModelingCommandType.EditTypeParameterType;
  modelId: ModelId;
  typeParameterId: TypeParameterId;
  typeReference: TypeReference;
};
