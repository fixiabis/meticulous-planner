import { BaseModelType, ModelId, TypeParameterId, TypeReferenceType } from './values';

export type TypeReferenceProps = {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly baseModel: BaseModelType | null;
  readonly typeParameterId: TypeParameterId | null;
  readonly typeArguments: Record<TypeParameterId, TypeReference>;
};

export type WithTypeReferenceProps = Partial<
  Pick<TypeReferenceProps, 'type' | 'modelId' | 'baseModel' | 'typeParameterId' | 'typeArguments'>
>;

export type CreateTypeReferenceProps = Partial<TypeReferenceProps> & Pick<TypeReferenceProps, 'type'>;

export class TypeReference implements TypeReferenceProps {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly baseModel: BaseModelType | null;
  readonly typeParameterId: TypeParameterId | null;
  readonly typeArguments: Record<TypeParameterId, TypeReference>;

  constructor(props: TypeReferenceProps) {
    this.type = props.type;
    this.modelId = props.modelId;
    this.baseModel = props.baseModel;
    this.typeParameterId = props.typeParameterId;
    this.typeArguments = props.typeArguments;
  }

  static create(props: CreateTypeReferenceProps) {
    return new TypeReference({
      type: props.type,
      modelId: props.modelId ?? null,
      baseModel: props.baseModel ?? null,
      typeParameterId: props.typeParameterId ?? null,
      typeArguments: props.typeArguments ?? {},
    });
  }

  static createModel(modelId: ModelId) {
    return TypeReference.create({ type: TypeReferenceType.Model, modelId });
  }

  static createBaseModel(baseModel: BaseModelType) {
    return TypeReference.create({ type: TypeReferenceType.BaseModel, baseModel });
  }

  static createTypeParameter(modelId: ModelId, typeParameterId: TypeParameterId) {
    return TypeReference.create({ type: TypeReferenceType.TypeParameter, modelId, typeParameterId })
  }

  static none() {
    return new TypeReference({
      type: TypeReferenceType.Model,
      modelId: null,
      baseModel: BaseModelType.None,
      typeParameterId: null,
      typeArguments: {},
    });
  }

  private withProps(props: WithTypeReferenceProps) {
    return new TypeReference({ ...this, ...props });
  }

  // editType(type: TypeReferenceType) {
  //   return this.withProps({ type });
  // }

  // editModelId(modelId: ModelId | null) {
  //   return this.withProps({ type: TypeReferenceType.Model, modelId });
  // }

  // editBaseModel(baseModel: BaseModelType | null) {
  //   return this.withProps({ type: TypeReferenceType.BaseModel, baseModel });
  // }

  // editTypeParameterId(typeParameterId: TypeParameterId | null) {
  //   return this.withProps({ type: TypeReferenceType.TypeParameter, typeParameterId });
  // }

  editTypeArgument(typeParameterId: TypeParameterId, typeReference: TypeReference | null) {
    return this.withProps({ typeArguments: { ...this.typeArguments, [typeParameterId]: typeReference } });
  }
}
