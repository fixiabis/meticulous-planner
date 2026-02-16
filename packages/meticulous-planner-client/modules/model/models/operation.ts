import { Expression } from './expression';
import { Parameter } from './parameter';
import { TypeReference } from './type-reference';
import { ExpressionLanguage, Multiplicity, OperationId, ParameterId } from './values';

export type OperationProps = {
  readonly id: OperationId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly returnType: TypeReference;
  readonly returnMultiplicity: Multiplicity;
  readonly parameters: Parameter[];
};

export type CreateOperationProps = Pick<OperationProps, 'id'> & Partial<OperationProps>;

export class Operation implements OperationProps {
  readonly id: OperationId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly returnType: TypeReference;
  readonly returnMultiplicity: Multiplicity;
  readonly parameters: Parameter[];

  constructor(props: OperationProps) {
    this.id = props.id;
    this.returnType = props.returnType;
    this.returnMultiplicity = props.returnMultiplicity;
    this.names = props.names;
    this.parameters = props.parameters;
  }

  static create(props: CreateOperationProps): Operation {
    return new Operation({
      id: props.id,
      names: props.names ?? {},
      returnType: props.returnType ?? TypeReference.string(),
      returnMultiplicity: props.returnMultiplicity ?? Multiplicity.Single,
      parameters: props.parameters ?? [],
    });
  }

  private withProps(props: Partial<OperationProps>): Operation {
    return Operation.create({ ...this, ...props });
  }

  editReturnType(returnType: TypeReference): Operation {
    return this.withProps({ returnType });
  }

  editReturnMultiplicity(returnMultiplicity: Multiplicity): Operation {
    return this.withProps({ returnMultiplicity });
  }

  editName(language: ExpressionLanguage, name: string): Operation {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }

  private withParameter(parameterId: ParameterId, editFn: (parameter: Parameter) => Parameter): Operation {
    const parameter = this.parameters.find((p) => p.id === parameterId);
    if (!parameter) {
      throw new Error(`Parameter with id ${parameterId} not found`);
    }
    const updatedParameter = editFn(parameter);
    const parameters = this.parameters.map((p) => (p.id === parameterId ? updatedParameter : p));
    return this.withProps({ parameters });
  }

  editParameterType(parameterId: ParameterId, type: TypeReference): Operation {
    return this.withParameter(parameterId, (parameter) => parameter.editType(type));
  }

  editParameterMultiplicity(parameterId: ParameterId, multiplicity: Multiplicity): Operation {
    return this.withParameter(parameterId, (parameter) => parameter.editMultiplicity(multiplicity));
  }

  editParameterName(parameterId: ParameterId, language: ExpressionLanguage, name: string): Operation {
    return this.withParameter(parameterId, (parameter) => parameter.editName(language, name));
  }

  addParameter(parameterId: ParameterId): Operation {
    const parameter = Parameter.create({ id: parameterId });
    const parameters = [...this.parameters, parameter];
    return this.withProps({ parameters });
  }

  removeParameter(parameterId: ParameterId): Operation {
    const parameters = this.parameters.filter((p) => p.id !== parameterId);
    return this.withProps({ parameters });
  }
}
