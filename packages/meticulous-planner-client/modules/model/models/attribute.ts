import { Expression } from './expression';
import { TypeReference } from './type-reference';
import { AttributeId, ExpressionLanguage, Multiplicity } from './values';

export type AttributeProps = {
  readonly id: AttributeId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;
  readonly multiplicity: Multiplicity;
};

export type CreateAttributeProps = Pick<AttributeProps, 'id'> & Partial<AttributeProps>;

export class Attribute implements AttributeProps {
  readonly id: AttributeId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;
  readonly multiplicity: Multiplicity;

  constructor(props: AttributeProps) {
    this.id = props.id;
    this.names = props.names;
    this.type = props.type;
    this.multiplicity = props.multiplicity;
  }

  static create(props: CreateAttributeProps): Attribute {
    return new Attribute({
      id: props.id,
      names: props.names ?? {},
      type: props.type ?? TypeReference.string(),
      multiplicity: props.multiplicity ?? Multiplicity.Single,
    });
  }

  private withProps(props: Partial<AttributeProps>): Attribute {
    return Attribute.create({ ...this, ...props });
  }

  editName(language: ExpressionLanguage, name: string): Attribute {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }

  editType(type: TypeReference): Attribute {
    return this.withProps({ type });
  }

  editMultiplicity(multiplicity: Multiplicity): Attribute {
    return this.withProps({ multiplicity });
  }
}
