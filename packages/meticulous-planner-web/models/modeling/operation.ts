import { Description } from './description';
import { Parameter } from './parameter';
import { TypeReference } from './type-reference';
import { Language, Multiplicity, OperationId, ParameterId } from './values';

export type OperationProps = {
  readonly id: OperationId;
  readonly parameters: readonly Parameter[];
  readonly returnType: TypeReference | null;
  readonly returnMultiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithOperationProps = Partial<Omit<OperationProps, 'id'>>;

export type CreateOperationProps = Partial<OperationProps> & Pick<OperationProps, 'id'>;

export class Operation implements OperationProps {
  readonly id: OperationId;
  readonly parameters: readonly Parameter[];
  readonly returnType: TypeReference | null;
  readonly returnMultiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: OperationProps) {
    this.id = props.id;
    this.parameters = props.parameters;
    this.returnType = props.returnType;
    this.returnMultiplicity = props.returnMultiplicity;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateOperationProps) {
    return new Operation({
      id: props.id,
      parameters: props.parameters ?? [],
      returnType: props.returnType ?? null,
      returnMultiplicity: props.returnMultiplicity ?? Multiplicity.Single,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithOperationProps) {
    return new Operation({ ...this, ...props });
  }

  rename(name: string, language: Language): Operation {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }

  editReturnType(returnType: TypeReference | null) {
    return this.withProps({ returnType });
  }

  editReturnMultiplicity(returnMultiplicity: Multiplicity) {
    return this.withProps({ returnMultiplicity });
  }

  private withParameter(parameterId: ParameterId, edit: (parameter: Parameter) => Parameter) {
    return this.withProps({
      parameters: this.parameters.map((param) => (param.id === parameterId ? edit(param) : param)),
    });
  }

  addParameter(parameterId: ParameterId) {
    return this.withProps({ parameters: [...this.parameters, Parameter.create({ id: parameterId })] });
  }

  removeParameter(parameterId: ParameterId) {
    return this.withProps({ parameters: this.parameters.filter((parameter) => parameter.id !== parameterId) });
  }

  removeAllParameters() {
    return this.withProps({ parameters: [] });
  }

  renameParameter(parameterId: ParameterId, name: string, language: Language): Operation {
    return this.withParameter(parameterId, (param) => param.rename(name, language));
  }

  editParameterType(parameterId: ParameterId, type: TypeReference) {
    return this.withParameter(parameterId, (param) => param.editType(type));
  }

  editParameterMultiplicity(parameterId: ParameterId, multiplicity: Multiplicity) {
    return this.withParameter(parameterId, (param) => param.editMultiplicity(multiplicity));
  }
}
