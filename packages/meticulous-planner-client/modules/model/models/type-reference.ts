import { BaseModelType, ModelId, TypeParameterId, TypeReferenceType } from './values';

export type TypeReferenceProps = {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly baseModel: BaseModelType | null;
  readonly templateArguments: Record<TypeParameterId, TypeReference>;
};

export type CreateTypeReferenceProps = Pick<TypeReferenceProps, 'type'> & Partial<TypeReferenceProps>;

export class TypeReference implements TypeReferenceProps {
  readonly type: TypeReferenceType;
  readonly modelId: ModelId | null;
  readonly baseModel: BaseModelType | null;
  readonly templateArguments: Record<TypeParameterId, TypeReference>;

  constructor(props: TypeReferenceProps) {
    this.type = props.type;
    this.modelId = props.modelId;
    this.baseModel = props.baseModel;
    this.templateArguments = props.templateArguments;
  }

  static create(props: CreateTypeReferenceProps): TypeReference {
    return new TypeReference({
      type: props.type,
      modelId: props.modelId ?? null,
      baseModel: props.baseModel ?? BaseModelType.None,
      templateArguments: props.templateArguments ?? {},
    });
  }

  static string() {
    return TypeReference.create({ type: TypeReferenceType.Base, baseModel: BaseModelType.String });
  }

  static none() {
    return TypeReference.create({ type: TypeReferenceType.Base, baseModel: BaseModelType.None });
  }
}
