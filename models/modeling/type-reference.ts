import { ModelId, TypeParameterId, TypeReferenceType } from './values';

export type TypeReferenceProps = {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly typeParameterId: TypeParameterId | null;
  readonly typeArguments: Record<TypeParameterId, TypeReference>;
};

export type WithTypeReferenceProps = Partial<TypeReferenceProps>;

export type CreateTypeReferenceProps = Partial<TypeReferenceProps> & Pick<TypeReferenceProps, 'type'>;

export class TypeReference implements TypeReferenceProps {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly typeParameterId: TypeParameterId | null;
  readonly typeArguments: Record<TypeParameterId, TypeReference>;

  constructor(props: TypeReferenceProps) {
    this.type = props.type;
    this.modelId = props.modelId;
    this.typeParameterId = props.typeParameterId;
    this.typeArguments = props.typeArguments;
  }

  static create(props: CreateTypeReferenceProps) {
    return new TypeReference({
      type: props.type,
      modelId: props.modelId ?? null,
      typeParameterId: props.typeParameterId ?? null,
      typeArguments: props.typeArguments ?? {},
    });
  }

  static createModel(modelId: ModelId | null) {
    return TypeReference.create({ type: TypeReferenceType.Model, modelId });
  }

  static createTypeParameter(modelId: ModelId, typeParameterId: TypeParameterId) {
    return TypeReference.create({ type: TypeReferenceType.TypeParameter, modelId, typeParameterId });
  }

  private withProps(props: WithTypeReferenceProps) {
    return new TypeReference({ ...this, ...props });
  }

  editTypeArgument(typeParameterId: TypeParameterId, typeReference: TypeReference | null) {
    return this.withProps({ typeArguments: { ...this.typeArguments, [typeParameterId]: typeReference } });
  }
}
