import { Attribute } from './attribute';
import { Description } from './description';
import { EnumerationItem } from './enumeration-item';
import { Operation } from './operation';
import { TypeParameter } from './type-parameter';
import { TypeReference } from './type-reference';
import {
  AttributeId,
  EnumerationItemId,
  Language,
  ModelId,
  ProjectId,
  ServiceId,
  Multiplicity,
  OperationId,
  OperationStereotype,
  ParameterId,
  SystemId,
  Stereotype,
  TypeParameterId,
} from './values';

export type ModelProps = {
  readonly id: ModelId;
  readonly projectId: ProjectId | null;
  readonly systemId: SystemId;
  readonly serviceId: ServiceId | null;
  readonly stereotype: Stereotype;
  readonly generalizationType: TypeReference | null;
  readonly attributes: readonly Attribute[];
  readonly operations: readonly Operation[];
  readonly typeParameters: readonly TypeParameter[];
  readonly enumerationItems: readonly EnumerationItem[];
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithModelProps = Partial<Omit<ModelProps, 'id' | 'projectId' | 'systemId'>>;

export type CreateModelProps = Partial<ModelProps> & Pick<ModelProps, 'id' | 'systemId'>;

export class Model implements ModelProps {
  readonly id: ModelId;
  readonly projectId: ProjectId | null;
  readonly systemId: SystemId;
  readonly serviceId: ServiceId | null;
  readonly stereotype: Stereotype;
  readonly generalizationType: TypeReference | null;
  readonly attributes: readonly Attribute[];
  readonly operations: readonly Operation[];
  readonly typeParameters: readonly TypeParameter[];
  readonly enumerationItems: readonly EnumerationItem[];
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ModelProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.systemId = props.systemId;
    this.serviceId = props.serviceId;
    this.stereotype = props.stereotype;
    this.generalizationType = props.generalizationType;
    this.attributes = props.attributes;
    this.operations = props.operations;
    this.typeParameters = props.typeParameters;
    this.enumerationItems = props.enumerationItems;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateModelProps) {
    return new Model({
      id: props.id,
      projectId: props.projectId ?? null,
      systemId: props.systemId ?? null,
      serviceId: props.serviceId ?? null,
      stereotype: props.stereotype ?? Stereotype.Entity,
      generalizationType: props.generalizationType ?? null,
      attributes: props.attributes ?? [],
      operations: props.operations ?? [],
      typeParameters: props.typeParameters ?? [],
      enumerationItems: props.enumerationItems ?? [],
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

  moveToService(serviceId: ServiceId | null) {
    return this.withProps({ serviceId });
  }

  private withAttribute(attributeId: AttributeId, edit: (attr: Attribute) => Attribute) {
    return this.withProps({
      attributes: this.attributes.map((attr) => (attr.id === attributeId ? edit(attr) : attr)),
    });
  }

  addAttribute(attributeId: AttributeId) {
    return this.withProps({ attributes: [...this.attributes, Attribute.create({ id: attributeId })] });
  }

  removeAttribute(attributeId: AttributeId) {
    return this.withProps({ attributes: this.attributes.filter((attr) => attr.id !== attributeId) });
  }

  removeAllAttributes() {
    return this.withProps({ attributes: [] });
  }

  renameAttribute(attributeId: AttributeId, name: string, language: Language) {
    return this.withAttribute(attributeId, (attr) => attr.rename(name, language));
  }

  editAttributeType(attributeId: AttributeId, type: TypeReference | null) {
    return this.withAttribute(attributeId, (attr) => attr.editType(type));
  }

  editAttributeMultiplicity(attributeId: AttributeId, multiplicity: Multiplicity) {
    return this.withAttribute(attributeId, (attr) => attr.editMultiplicity(multiplicity));
  }

  private withOperation(operationId: OperationId, edit: (operation: Operation) => Operation) {
    return this.withProps({
      operations: this.operations.map((op) => (op.id === operationId ? edit(op) : op)),
    });
  }

  addOperation(operationId: OperationId, stereotype: OperationStereotype) {
    return this.withProps({ operations: [...this.operations, Operation.create({ id: operationId, stereotype })] });
  }

  removeOperation(operationId: OperationId) {
    return this.withProps({ operations: this.operations.filter((op) => op.id !== operationId) });
  }

  removeAllOperation() {
    return this.withProps({ operations: [] });
  }

  removeAllOperationsByStereotype(stereotype: OperationStereotype) {
    return this.withProps({ operations: this.operations.filter((op) => op.stereotype !== stereotype) });
  }

  renameOperation(operationId: OperationId, name: string, language: Language) {
    return this.withOperation(operationId, (op) => op.rename(name, language));
  }

  editOperationReturnType(operationId: OperationId, type: TypeReference | null) {
    return this.withOperation(operationId, (op) => op.editReturnType(type));
  }

  editOperationMultiplicity(operationId: OperationId, multiplicity: Multiplicity) {
    return this.withOperation(operationId, (op) => op.editReturnMultiplicity(multiplicity));
  }

  editOperationStereotype(operationId: OperationId, stereotype: OperationStereotype) {
    return this.withOperation(operationId, (op) => op.editStereotype(stereotype));
  }

  addOperationParameter(operationId: OperationId, parameterId: ParameterId) {
    return this.withOperation(operationId, (op) => op.addParameter(parameterId));
  }

  removeOperationParameter(operationId: OperationId, parameterId: ParameterId) {
    return this.withOperation(operationId, (op) => op.removeParameter(parameterId));
  }

  removeOperationAllParameters(operationId: OperationId) {
    return this.withOperation(operationId, (op) => op.removeAllParameters());
  }

  renameOperationParameter(operationId: OperationId, parameterId: ParameterId, name: string, language: Language) {
    return this.withOperation(operationId, (op) => op.renameParameter(parameterId, name, language));
  }

  editOperationParameterType(operationId: OperationId, parameterId: ParameterId, type: TypeReference) {
    return this.withOperation(operationId, (op) => op.editParameterType(parameterId, type));
  }

  editOperationParameterMultiplicity(operationId: OperationId, parameterId: ParameterId, multiplicity: Multiplicity) {
    return this.withOperation(operationId, (op) => op.editParameterMultiplicity(parameterId, multiplicity));
  }

  private withTypeParameter(typeParameterId: TypeParameterId, edit: (typeParameter: TypeParameter) => TypeParameter) {
    return this.withProps({
      typeParameters: this.typeParameters.map((tp) => (tp.id === typeParameterId ? edit(tp) : tp)),
    });
  }

  addTypeParameter(typeParameterId: TypeParameterId) {
    return this.withProps({ typeParameters: [...this.typeParameters, TypeParameter.create({ id: typeParameterId })] });
  }

  removeTypeParameters(typeParameterId: TypeParameterId) {
    return this.withProps({
      typeParameters: this.typeParameters.filter((tp) => tp.id !== typeParameterId),
    });
  }

  removeAllTypeParameters() {
    return this.withProps({ typeParameters: [] });
  }

  renameTypeParameter(typeParameterId: TypeParameterId, name: string, language: Language) {
    return this.withTypeParameter(typeParameterId, (tp) => tp.rename(name, language));
  }

  editTypeParameterConstraintType(typeParameterId: TypeParameterId, type: TypeReference | null) {
    return this.withTypeParameter(typeParameterId, (tp) => tp.editConstraintType(type));
  }

  private withEnumerationItem(
    enumerationItemId: EnumerationItemId,
    edit: (item: EnumerationItem) => EnumerationItem,
  ) {
    return this.withProps({
      enumerationItems: this.enumerationItems.map((item) => (item.id === enumerationItemId ? edit(item) : item)),
    });
  }

  addEnumerationItem(enumerationItemId: EnumerationItemId) {
    return this.withProps({
      enumerationItems: [...this.enumerationItems, EnumerationItem.create({ id: enumerationItemId })],
    });
  }

  removeEnumerationItem(enumerationItemId: EnumerationItemId) {
    return this.withProps({
      enumerationItems: this.enumerationItems.filter((item) => item.id !== enumerationItemId),
    });
  }

  removeAllEnumerationItems() {
    return this.withProps({ enumerationItems: [] });
  }

  renameEnumerationItem(enumerationItemId: EnumerationItemId, name: string, language: Language) {
    return this.withEnumerationItem(enumerationItemId, (item) => item.rename(name, language));
  }

  editEnumerationItemCode(enumerationItemId: EnumerationItemId, code: string) {
    return this.withEnumerationItem(enumerationItemId, (item) => item.editCode(code));
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
