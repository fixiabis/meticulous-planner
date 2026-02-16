import {
  AddAttribute,
  AddEnumerationItem,
  AddOperation,
  AddOperationParameter,
  AddTypeParameter,
  CreateModel,
  EditAttributeMultiplicity,
  EditAttributeName,
  EditAttributeType,
  EditEnumerationItemCode,
  EditEnumerationItemName,
  EditModelName,
  EditModelTemplateType,
  EditOperationName,
  EditOperationParameterMultiplicity,
  EditOperationParameterName,
  EditOperationParameterType,
  EditOperationReturnMultiplicity,
  EditOperationReturnType,
  EditTypeParameterName,
  EditTypeParameterType,
  RemoveAttribute,
  RemoveEnumerationItem,
  RemoveOperation,
  RemoveOperationParameter,
  RemoveTypeParameter,
} from '../messages/command';
import { GetProjectModels } from '../messages/query';
import { Model } from '../models/model';
import { ModelRepository } from './model-repository';

export class ModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async getProjectModels(query: GetProjectModels): Promise<Model[]> {
    return this.modelRepository.getProjectModels(query.projectId);
  }

  async createModel(command: CreateModel): Promise<Model> {
    const modelId = await this.modelRepository.generateModelId();

    const createdModel = Model.create({
      id: modelId,
      projectId: command.projectId,
      stereotype: command.stereotype,
    });

    return this.modelRepository.saveModel(createdModel);
  }

  async editModelName(command: EditModelName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editName(command.language, command.name);
    return this.modelRepository.saveModel(editedModel);
  }

  async editModelTemplateType(command: EditModelTemplateType): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editTemplateType(command.templateType);
    return this.modelRepository.saveModel(editedModel);
  }

  async addAttribute(command: AddAttribute): Promise<Model> {
    const attributeId = await this.modelRepository.generateAttributeId();
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.addAttribute(attributeId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async removeAttribute(command: RemoveAttribute): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.removeAttribute(command.attributeId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async editAttributeName(command: EditAttributeName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editAttributeName(command.attributeId, command.language, command.name);
    return this.modelRepository.saveModel(editedModel);
  }

  async editAttributeType(command: EditAttributeType): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editAttributeType(command.attributeId, command.typeReference);
    return this.modelRepository.saveModel(editedModel);
  }

  async editAttributeMultiplicity(command: EditAttributeMultiplicity): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editAttributeMultiplicity(command.attributeId, command.multiplicity);
    return this.modelRepository.saveModel(editedModel);
  }

  async addOperation(command: AddOperation): Promise<Model> {
    const operationId = await this.modelRepository.generateOperationId();
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.addOperation(operationId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async removeOperation(command: RemoveOperation): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.removeOperation(command.operationId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async editOperationName(command: EditOperationName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationName(command.operationId, command.language, command.name);
    return this.modelRepository.saveModel(editedModel);
  }

  async editOperationReturnType(command: EditOperationReturnType): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationReturnType(command.operationId, command.returnType);
    return this.modelRepository.saveModel(editedModel);
  }

  async editOperationReturnMultiplicity(command: EditOperationReturnMultiplicity): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationReturnMultiplicity(command.operationId, command.returnMultiplicity);
    return this.modelRepository.saveModel(editedModel);
  }

  async addOperationParameter(command: AddOperationParameter): Promise<Model> {
    const parameterId = await this.modelRepository.generateParameterId();
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.addOperationParameter(command.operationId, parameterId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async removeOperationParameter(command: RemoveOperationParameter): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.removeOperationParameter(command.operationId, command.parameterId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async editOperationParameterName(command: EditOperationParameterName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationParameterName(
      command.operationId,
      command.parameterId,
      command.language,
      command.name,
    );
    return this.modelRepository.saveModel(editedModel);
  }

  async editOperationParameterType(command: EditOperationParameterType): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationParameterType(
      command.operationId,
      command.parameterId,
      command.typeReference,
    );
    return this.modelRepository.saveModel(editedModel);
  }

  async editOperationParameterMultiplicity(command: EditOperationParameterMultiplicity): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editOperationParameterMultiplicity(
      command.operationId,
      command.parameterId,
      command.multiplicity,
    );
    return this.modelRepository.saveModel(editedModel);
  }

  async addEnumerationItem(command: AddEnumerationItem): Promise<Model> {
    const enumerationItemId = await this.modelRepository.generateEnumerationItemId();
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.addEnumerationItem(enumerationItemId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async removeEnumerationItem(command: RemoveEnumerationItem): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.removeEnumerationItem(command.enumerationItemId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async editEnumerationItemName(command: EditEnumerationItemName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editEnumerationItemName(command.enumerationItemId, command.language, command.name);
    return this.modelRepository.saveModel(editedModel);
  }

  async editEnumerationItemCode(command: EditEnumerationItemCode): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editEnumerationItemCode(command.enumerationItemId, command.code);
    return this.modelRepository.saveModel(editedModel);
  }

  async addTypeParameter(command: AddTypeParameter): Promise<Model> {
    const typeParameterId = await this.modelRepository.generateTypeParameterId();
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.addTypeParameter(typeParameterId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async removeTypeParameter(command: RemoveTypeParameter): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const updatedModel = model.removeTypeParameter(command.typeParameterId);
    return this.modelRepository.saveModel(updatedModel);
  }

  async editTypeParameterName(command: EditTypeParameterName): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editTypeParameterName(command.typeParameterId, command.language, command.name);
    return this.modelRepository.saveModel(editedModel);
  }

  async editTypeParameterType(command: EditTypeParameterType): Promise<Model> {
    const model = await this.modelRepository.getModel(command.modelId);
    const editedModel = model.editTypeParameterType(command.typeParameterId, command.typeReference);
    return this.modelRepository.saveModel(editedModel);
  }
}
