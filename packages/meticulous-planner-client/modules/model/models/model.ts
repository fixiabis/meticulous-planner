import { Expression } from './expression';
import { Attribute } from './attribute';
import { EnumerationItem } from './enumeration-item';
import { Operation } from './operation';
import { TypeParameter } from './type-parameter';
import { TypeReference } from './type-reference';
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
} from './values';
import { ProjectId } from '../../../project/models/values';

export type ModelProps = {
  readonly id: ModelId;
  readonly projectId: ProjectId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly stereotype: ModelStereotype;
  readonly templateType: TypeReference;
  readonly typeParameters: TypeParameter[];
  readonly attributes: Attribute[];
  readonly operations: Operation[];
  readonly enumerationItems: EnumerationItem[];
};

export type CreateModelProps = Pick<ModelProps, 'id' | 'projectId'> & Partial<ModelProps>;

export class Model implements ModelProps {
  readonly id: ModelId;
  readonly projectId: ProjectId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly stereotype: ModelStereotype;
  readonly templateType: TypeReference;
  readonly typeParameters: TypeParameter[];
  readonly attributes: Attribute[];
  readonly operations: Operation[];
  readonly enumerationItems: EnumerationItem[];

  constructor(props: ModelProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.names = props.names;
    this.stereotype = props.stereotype;
    this.templateType = props.templateType;
    this.typeParameters = props.typeParameters;
    this.attributes = props.attributes;
    this.operations = props.operations;
    this.enumerationItems = props.enumerationItems;
  }

  static create(props: CreateModelProps): Model {
    return new Model({
      id: props.id,
      projectId: props.projectId,
      names: props.names ?? {},
      stereotype: props.stereotype ?? ModelStereotype.Entity,
      templateType: props.templateType ?? TypeReference.none(),
      typeParameters: props.typeParameters ?? [],
      attributes: props.attributes ?? [],
      operations: props.operations ?? [],
      enumerationItems: props.enumerationItems ?? [],
    });
  }

  private withProps(props: Partial<ModelProps>): Model {
    return Model.create({ ...this, ...props });
  }

  editName(language: ExpressionLanguage, name: string): Model {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }

  editTemplateType(templateType: TypeReference): Model {
    return this.withProps({ templateType });
  }

  private withAttribute(attributeId: AttributeId, editFn: (attribute: Attribute) => Attribute): Model {
    const attribute = this.attributes.find((a) => a.id === attributeId);
    if (!attribute) {
      throw new Error(`Attribute with id ${attributeId} not found`);
    }
    const updatedAttribute = editFn(attribute);
    const attributes = this.attributes.map((a) => (a.id === attributeId ? updatedAttribute : a));
    return this.withProps({ attributes });
  }

  addAttribute(attributeId: AttributeId): Model {
    const attribute = Attribute.create({ id: attributeId });
    const attributes = [...this.attributes, attribute];
    return this.withProps({ attributes });
  }

  removeAttribute(attributeId: AttributeId): Model {
    const attributes = this.attributes.filter((a) => a.id !== attributeId);
    return this.withProps({ attributes });
  }

  editAttributeName(attributeId: AttributeId, language: ExpressionLanguage, name: string): Model {
    return this.withAttribute(attributeId, (attribute) => attribute.editName(language, name));
  }

  editAttributeType(attributeId: AttributeId, type: TypeReference): Model {
    return this.withAttribute(attributeId, (attribute) => attribute.editType(type));
  }

  editAttributeMultiplicity(attributeId: AttributeId, multiplicity: Multiplicity): Model {
    return this.withAttribute(attributeId, (attribute) => attribute.editMultiplicity(multiplicity));
  }

  private withOperation(operationId: OperationId, editFn: (operation: Operation) => Operation): Model {
    const operation = this.operations.find((o) => o.id === operationId);
    if (!operation) {
      throw new Error(`Operation with id ${operationId} not found`);
    }
    const updatedOperation = editFn(operation);
    const operations = this.operations.map((o) => (o.id === operationId ? updatedOperation : o));
    return this.withProps({ operations });
  }

  addOperation(operationId: OperationId): Model {
    const operation = Operation.create({ id: operationId });
    const operations = [...this.operations, operation];
    return this.withProps({ operations });
  }

  removeOperation(operationId: OperationId): Model {
    const operations = this.operations.filter((o) => o.id !== operationId);
    return this.withProps({ operations });
  }

  editOperationName(operationId: OperationId, language: ExpressionLanguage, name: string): Model {
    return this.withOperation(operationId, (operation) => operation.editName(language, name));
  }

  editOperationReturnType(operationId: OperationId, returnType: TypeReference): Model {
    return this.withOperation(operationId, (operation) => operation.editReturnType(returnType));
  }

  editOperationReturnMultiplicity(operationId: OperationId, returnMultiplicity: Multiplicity): Model {
    return this.withOperation(operationId, (operation) => operation.editReturnMultiplicity(returnMultiplicity));
  }

  addOperationParameter(operationId: OperationId, parameterId: ParameterId): Model {
    return this.withOperation(operationId, (operation) => operation.addParameter(parameterId));
  }

  removeOperationParameter(operationId: OperationId, parameterId: ParameterId): Model {
    return this.withOperation(operationId, (operation) => operation.removeParameter(parameterId));
  }

  editOperationParameterName(
    operationId: OperationId,
    parameterId: ParameterId,
    language: ExpressionLanguage,
    name: string,
  ): Model {
    return this.withOperation(operationId, (operation) => operation.editParameterName(parameterId, language, name));
  }

  editOperationParameterType(operationId: OperationId, parameterId: ParameterId, type: TypeReference): Model {
    return this.withOperation(operationId, (operation) => operation.editParameterType(parameterId, type));
  }

  editOperationParameterMultiplicity(
    operationId: OperationId,
    parameterId: ParameterId,
    multiplicity: Multiplicity,
  ): Model {
    return this.withOperation(operationId, (operation) =>
      operation.editParameterMultiplicity(parameterId, multiplicity),
    );
  }

  private withEnumerationItem(
    enumerationItemId: EnumerationItemId,
    editFn: (enumerationItem: EnumerationItem) => EnumerationItem,
  ): Model {
    const enumerationItem = this.enumerationItems.find((e) => e.id === enumerationItemId);
    if (!enumerationItem) {
      throw new Error(`EnumerationItem with id ${enumerationItemId} not found`);
    }
    const updatedEnumerationItem = editFn(enumerationItem);
    const enumerationItems = this.enumerationItems.map((e) =>
      e.id === enumerationItemId ? updatedEnumerationItem : e,
    );
    return this.withProps({ enumerationItems });
  }

  addEnumerationItem(enumerationItemId: EnumerationItemId): Model {
    const enumerationItem = EnumerationItem.create({ id: enumerationItemId });
    const enumerationItems = [...this.enumerationItems, enumerationItem];
    return this.withProps({ enumerationItems });
  }

  removeEnumerationItem(enumerationItemId: EnumerationItemId): Model {
    const enumerationItems = this.enumerationItems.filter((e) => e.id !== enumerationItemId);
    return this.withProps({ enumerationItems });
  }

  editEnumerationItemName(enumerationItemId: EnumerationItemId, language: ExpressionLanguage, name: string): Model {
    return this.withEnumerationItem(enumerationItemId, (enumerationItem) => enumerationItem.editName(language, name));
  }

  editEnumerationItemCode(enumerationItemId: EnumerationItemId, code: string): Model {
    return this.withEnumerationItem(enumerationItemId, (enumerationItem) => enumerationItem.editCode(code));
  }

  private withTypeParameter(
    typeParameterId: TypeParameterId,
    editFn: (typeParameter: TypeParameter) => TypeParameter,
  ): Model {
    const typeParameter = this.typeParameters.find((t) => t.id === typeParameterId);
    if (!typeParameter) {
      throw new Error(`TypeParameter with id ${typeParameterId} not found`);
    }
    const updatedTypeParameter = editFn(typeParameter);
    const typeParameters = this.typeParameters.map((t) => (t.id === typeParameterId ? updatedTypeParameter : t));
    return this.withProps({ typeParameters });
  }

  addTypeParameter(typeParameterId: TypeParameterId): Model {
    const typeParameter = TypeParameter.create({ id: typeParameterId });
    const typeParameters = [...this.typeParameters, typeParameter];
    return this.withProps({ typeParameters });
  }

  removeTypeParameter(typeParameterId: TypeParameterId): Model {
    const typeParameters = this.typeParameters.filter((t) => t.id !== typeParameterId);
    return this.withProps({ typeParameters });
  }

  editTypeParameterName(typeParameterId: TypeParameterId, language: ExpressionLanguage, name: string): Model {
    return this.withTypeParameter(typeParameterId, (typeParameter) => typeParameter.editName(language, name));
  }

  editTypeParameterType(typeParameterId: TypeParameterId, type: TypeReference): Model {
    return this.withTypeParameter(typeParameterId, (typeParameter) => typeParameter.editType(type));
  }
}
