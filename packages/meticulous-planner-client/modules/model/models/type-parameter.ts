import { Expression } from './expression';
import { TypeReference } from './type-reference';
import { ExpressionLanguage, TypeParameterId } from './values';

export type TypeParameterProps = {
  readonly id: TypeParameterId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;
};

export type CreateTypeParameterProps = Pick<TypeParameterProps, 'id'> & Partial<TypeParameterProps>;

export class TypeParameter implements TypeParameterProps {
  readonly id: TypeParameterId;
  readonly names: Partial<Record<ExpressionLanguage, Expression>>;
  readonly type: TypeReference;

  constructor(props: TypeParameterProps) {
    this.id = props.id;
    this.type = props.type;
    this.names = props.names;
  }

  static create(props: CreateTypeParameterProps): TypeParameter {
    return new TypeParameter({
      id: props.id,
      names: props.names ?? {},
      type: props.type ?? TypeReference.string(),
    });
  }

  private withProps(props: Partial<TypeParameterProps>): TypeParameter {
    return TypeParameter.create({ ...this, ...props });
  }

  editName(language: ExpressionLanguage, name: string): TypeParameter {
    const expression = new Expression({ language, content: name });
    const names = { ...this.names, [language]: expression };
    return this.withProps({ names });
  }

  editType(type: TypeReference): TypeParameter {
    return this.withProps({ type });
  }
}
