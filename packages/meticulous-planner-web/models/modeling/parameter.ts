import { Description } from './description';
import { TypeReference } from './type-reference';
import { Language, Multiplicity, ParameterId } from './values';

export type ParameterProps = {
  readonly id: ParameterId;
  readonly type: TypeReference | null;
  readonly multiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithParameterProps = Partial<Omit<ParameterProps, 'id'>>;

export type CreateParameterProps = Partial<ParameterProps> & Pick<ParameterProps, 'id'>;

export class Parameter implements ParameterProps {
  readonly id: ParameterId;
  readonly type: TypeReference | null;
  readonly multiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: ParameterProps) {
    this.id = props.id;
    this.type = props.type;
    this.multiplicity = props.multiplicity;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateParameterProps) {
    return new Parameter({
      id: props.id,
      type: props.type ?? null,
      multiplicity: props.multiplicity ?? Multiplicity.Single,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithParameterProps) {
    return new Parameter({ ...this, ...props });
  }

  editType(type: TypeReference) {
    return this.withProps({ type });
  }

  editMultiplicity(multiplicity: Multiplicity) {
    return this.withProps({ multiplicity });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }
}
