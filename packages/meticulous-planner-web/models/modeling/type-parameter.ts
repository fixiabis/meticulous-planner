import { Description } from './description';
import { TypeReference } from './type-reference';
import { Language, TypeParameterId } from './values';

export type TypeParameterProps = {
  readonly id: TypeParameterId;
  readonly constraintType: TypeReference | null;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;
};

export type WithTypeParameterProps = Partial<Omit<TypeParameterProps, 'id'>>;

export type CreateTypeParameterProps = Partial<TypeParameterProps> & Pick<TypeParameterProps, 'id'>;

export class TypeParameter implements TypeParameterProps {
  readonly id: TypeParameterId;
  readonly constraintType: TypeReference | null;
  readonly descriptions: Readonly<Partial<Record<Language, Description>>>;

  constructor(props: TypeParameterProps) {
    this.id = props.id;
    this.constraintType = props.constraintType;
    this.descriptions = props.descriptions;
  }

  static create(props: CreateTypeParameterProps) {
    return new TypeParameter({
      id: props.id,
      constraintType: props.constraintType ?? null,
      descriptions: props.descriptions ?? {},
    });
  }

  private withProps(props: WithTypeParameterProps) {
    return new TypeParameter({ ...this, ...props });
  }

  rename(name: string, language: Language) {
    return this.withProps({
      descriptions: { ...this.descriptions, [language]: Description.create({ name, language }) },
    });
  }

  editConstraintType(constraintType: TypeReference | null) {
    return this.withProps({ constraintType });
  }
}
