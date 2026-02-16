import { Expression } from './expression';
import { TypeReference } from './type-reference';
import { ExpressionLanguage, Multiplicity, ParameterId } from './values';

export type ParameterProps = {
  readonly id: ParameterId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;
  readonly multiplicity: Multiplicity;
};

export type CreateParameterProps = Pick<ParameterProps, 'id'> & Partial<ParameterProps>;

export class Parameter implements ParameterProps {
  readonly id: ParameterId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;
  readonly multiplicity: Multiplicity;

  constructor(props: ParameterProps) {
    this.id = props.id;
    this.names = props.names;
    this.type = props.type;
    this.multiplicity = props.multiplicity;
  }

  static create(props: CreateParameterProps): Parameter {
    return new Parameter({
      id: props.id,
      names: props.names ?? {},
      type: props.type ?? TypeReference.string(),
      multiplicity: props.multiplicity ?? Multiplicity.Single,
    });
  }

  private withProps(props: Partial<ParameterProps>): Parameter {
    return Parameter.create({ ...this, ...props });
  }

  editType(type: TypeReference): Parameter {
    return this.withProps({ type });
  }

  editMultiplicity(multiplicity: Multiplicity): Parameter {
    return this.withProps({ multiplicity });
  }

  editName(language: ExpressionLanguage, name: string): Parameter {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }
}
