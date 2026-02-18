import { Attribute } from './attribute';
import { Description } from './description';
import { Operation } from './operation';
import { TypeParameter } from './type-parameter';
import { TypeReference } from './type-reference';
import {
  AttributeId,
  Language,
  ModelId,
  ModuleId,
  Multiplicity,
  OperationId,
  ProjectId,
  Stereotype,
  TypeParameterId,
} from './values';

export type ModelProps = {
  readonly id: ModelId;
  readonly projectId: ProjectId | null;
  readonly moduleId: ModuleId | null;
  readonly stereotype: Stereotype;
  readonly generalizationType: TypeReference | null;
  readonly attributes: readonly Attribute[];
  readonly operations: readonly Operation[];
  readonly typeParameters: readonly TypeParameter[];
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithModelProps = Partial<Omit<ModelProps, 'id'>>;

export type CreateModelProps = Partial<ModelProps> & Pick<ModelProps, 'id'>;

export class Model implements ModelProps {
  readonly id: ModelId;
  readonly projectId: ProjectId | null;
  readonly moduleId: ModuleId | null;
  readonly stereotype: Stereotype;
  readonly generalizationType: TypeReference | null;
  readonly attributes: readonly Attribute[];
  readonly operations: readonly Operation[];
  readonly typeParameters: readonly TypeParameter[];
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ModelProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.moduleId = props.moduleId;
    this.stereotype = props.stereotype;
    this.generalizationType = props.generalizationType;
    this.attributes = props.attributes;
    this.operations = props.operations;
    this.typeParameters = props.typeParameters;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateModelProps) {
    return new Model({
      id: props.id,
      projectId: props.projectId ?? null,
      moduleId: props.moduleId ?? null,
      stereotype: props.stereotype ?? Stereotype.Entity,
      generalizationType: props.generalizationType ?? null,
      attributes: props.attributes ?? [],
      operations: props.operations ?? [],
      typeParameters: props.typeParameters ?? [],
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithModelProps) {
    return new Model({ ...this, ...props });
  }

  editStereotype(stereotype: Stereotype) {
    return this.withProps({ stereotype });
  }

  editGeneralizationType(generalizationType: TypeReference | null) {
    return this.withProps({ generalizationType });
  }

  private withAttribute(attributeId: AttributeId, edit: (attribute: Attribute) => Attribute) {
    return this.withProps({
      attributes: this.attributes.map((attribute) => (attribute.id === attributeId ? edit(attribute) : attribute)),
    });
  }

  private addAttribute(attributeId: AttributeId) {
    return this.withProps({ attributes: [...this.attributes, Attribute.create({ id: attributeId })] });
  }

  editAttributeName(attributeId: AttributeId, name: string, language: Language) {
    return this.withAttribute(attributeId, (attribute) => attribute.rename(name, language));
  }

  editAttributeType(attributeId: AttributeId, type: TypeReference) {
    return this.withAttribute(attributeId, (attribute) => attribute.editType(type));
  }

  editAttributeMultiplicity(attributeId: AttributeId, multiplicity: Multiplicity) {
    return this.withAttribute(attributeId, (attribute) => attribute.editMultiplicity(multiplicity));
  }

  private withOperation(operationId: OperationId, edit: (operation: Operation) => Operation) {
    return this.withProps({
      operations: this.operations.map((operation) => (operation.id === operationId ? edit(operation) : operation)),
    });
  }

  editOperationName(operationId: OperationId, name: string, language: Language) {
    return this.withOperation(operationId, (operation) => operation.rename(name, language));
  }

  editOperationReturnType(operationId: OperationId, type: TypeReference) {
    return this.withOperation(operationId, (operation) => operation.editReturnType(type));
  }

  editOperationMultiplicity(operationId: OperationId, multiplicity: Multiplicity) {
    return this.withOperation(operationId, (operation) => operation.editReturnMultiplicity(multiplicity));
  }

  private withTypeParameter(typeParameterId: TypeParameterId, edit: (typeParameter: TypeParameter) => TypeParameter) {
    return this.withProps({
      typeParameters: this.typeParameters.map((typeParameter) =>
        typeParameter.id === typeParameterId ? edit(typeParameter) : typeParameter,
      ),
    });
  }

  editTypeParameterName(typeParameterId: TypeParameterId, name: string, language: Language) {
    return this.withTypeParameter(typeParameterId, (typeParameter) => typeParameter.rename(name, language));
  }

  editTypeParameterConstraintType(typeParameterId: TypeParameterId, type: TypeReference) {
    return this.withTypeParameter(typeParameterId, (typeParameter) => typeParameter.editConstraintType(type));
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
