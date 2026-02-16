import { Model } from '../models/model';
import { AttributeId, EnumerationItemId, ModelId, OperationId, ParameterId, TypeParameterId } from '../models/values';
import { ProjectId } from '../../project/models/values';

export interface ModelRepository {
  getProjectModels(projectId: ProjectId): Promise<Model[]>;
  getModel(modelId: ModelId): Promise<Model>;
  saveModel(model: Model): Promise<Model>;
  generateModelId(): Promise<ModelId>;
  generateAttributeId(): Promise<AttributeId>;
  generateOperationId(): Promise<OperationId>;
  generateParameterId(): Promise<ParameterId>;
  generateEnumerationItemId(): Promise<EnumerationItemId>;
  generateTypeParameterId(): Promise<TypeParameterId>;
}
