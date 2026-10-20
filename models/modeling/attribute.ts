import { Description } from './description';
import { TypeReference } from './type-reference';
import { AttributeId, Language, Multiplicity } from './values';

export type AttributeProps = {
  readonly id: AttributeId;
  readonly type: TypeReference | null;
  readonly multiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithAttributeProps = Partial<Omit<AttributeProps, 'id'>>;

export type CreateAttributeProps = Partial<AttributeProps> & Pick<AttributeProps, 'id'>;

export class Attribute implements AttributeProps {
  readonly id: AttributeId;
  readonly type: TypeReference | null;
  readonly multiplicity: Multiplicity;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: AttributeProps) {
    this.id = props.id;
    this.type = props.type;
    this.multiplicity = props.multiplicity;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateAttributeProps) {
    return new Attribute({
      id: props.id,
      type: props.type ?? null,
      multiplicity: props.multiplicity ?? Multiplicity.Single,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithAttributeProps) {
    return new Attribute({ ...this, ...props });
  }

  editType(type: TypeReference | null) {
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
