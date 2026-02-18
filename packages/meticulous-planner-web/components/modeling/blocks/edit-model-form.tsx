import { ContentEditable } from '@/components/base/content-editable';
import { Select } from '@/components/base/select';
import { useModel } from '@/hooks/modeling/use-model';
import {
  useEditModelGeneralizationType,
  useEditModelStereotype,
  useRenameModel,
} from '@/hooks/modeling/use-model-commands';
import {
  useAddModelTypeParameter,
  useEditModelTypeParameterConstraintType,
  useRemoveAllModelTypeParameters,
  useRenameModelTypeParameter,
} from '@/hooks/modeling/use-model-type-parameter-commands';
import { cn } from '@/lib/utils';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, TypeParameterId } from '@/models/modeling/values';
import { StereotypeSelect } from '../elements/stereotype-select';
import { ModuleSelector } from './module-selector';
import { TypeReferenceInput } from './type-reference-input';

export type EditModelFormProps = {
  className?: string;
  modelId: ModelId;
};

export function EditModelForm(props: EditModelFormProps) {
  const { model } = useModel(props.modelId);
  const { renameModel } = useRenameModel();
  const { editModelStereotype } = useEditModelStereotype();
  const { editModelGeneralizationType } = useEditModelGeneralizationType();
  const { addModelTypeParameter } = useAddModelTypeParameter();
  const { removeAllModelTypeParameters } = useRemoveAllModelTypeParameters();
  const { renameModelTypeParameter } = useRenameModelTypeParameter();
  const { editModelTypeParameterConstraintType } = useEditModelTypeParameterConstraintType();

  if (!model) {
    return <div className={cn('p-4 space-y-1', props.className)}></div>;
  }

  const name = (
    <ContentEditable
      className={cn({ 'inline-block min-w-24': !model.descriptions[Language.Chinese]?.name })}
      content={model.descriptions[Language.Chinese]?.name || ''}
      placeholder="模型名稱"
      onEditUpdate={(name) => renameModel({ modelId: props.modelId, name, language: Language.Chinese })}
    />
  );

  return (
    <div className={cn('p-4 space-y-1', props.className)}>
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p>
        是<ModuleSelector projectId={model.projectId} language={Language.Chinese} value={model.moduleId} />
        中的
        <StereotypeSelect
          language={Language.Chinese}
          value={model.stereotype}
          onChange={(stereotype) => editModelStereotype({ modelId: props.modelId, stereotype })}
        />
        ，
        <Select
          value={model.generalizationType !== null}
          onChange={(hasGeneralization) => {
            editModelGeneralizationType({
              modelId: props.modelId,
              generalizationType: hasGeneralization ? TypeReference.createModel(null) : null,
            });
          }}
          items={[
            { label: '是基本概念', value: false },
            { label: '是一種' + (model.generalizationType ? '' : '...'), value: true },
          ]}
          valueStringify={String}
        />
        {model.generalizationType && (
          <TypeReferenceInput
            value={model.generalizationType}
            typeParameterModelId={model.id}
            language={Language.Chinese}
            onChange={(generalizationType) => {
              editModelGeneralizationType({
                modelId: props.modelId,
                generalizationType,
              });
            }}
          />
        )}
        ，
        <Select
          value={model.typeParameters.length > 0}
          onChange={(hasTypeParameter) => {
            if (hasTypeParameter) {
              addModelTypeParameter({ modelId: props.modelId, typeParameterId: TypeParameterId(crypto.randomUUID()) });
            } else {
              removeAllModelTypeParameters({ modelId: props.modelId });
            }
          }}
          items={[
            { label: '用途明確', value: false },
            { label: '用途廣泛', value: true },
          ]}
          valueStringify={String}
        />
      </p>
      {model.typeParameters.length > 0 && <p>由於用途廣泛，使用時需要補充以下資訊：</p>}
      {model.typeParameters.length > 0 && (
        <ul className="list-disc list-inside pl-4">
          {model.typeParameters.map((typeParameter) => (
            <li key={typeParameter.id}>
              <ContentEditable
                className={cn({ 'inline-block min-w-16': !typeParameter.descriptions[Language.Chinese]?.name })}
                content={typeParameter.descriptions[Language.Chinese]?.name || ''}
                placeholder="資訊名稱"
                onEditUpdate={(name) => renameModelTypeParameter({ modelId: props.modelId, typeParameterId: typeParameter.id, name, language: Language.Chinese })}
              />
              ：
              <Select
                value={typeParameter.constraintType !== null}
                onChange={(hasConstraintType) => {
                  editModelTypeParameterConstraintType({
                    modelId: props.modelId,
                    typeParameterId: typeParameter.id,
                    constraintType: hasConstraintType ? TypeReference.createModel(null) : null,
                  });
                }}
                items={[
                  { label: '可以是任意模型', value: false },
                  { label: '只能是' + (typeParameter.constraintType ? '' : '...'), value: true },
                ]}
                valueStringify={String}
              />
              {typeParameter.constraintType !== null && (
                <TypeReferenceInput
                  value={typeParameter.constraintType}
                  typeParameterModelId={model.id}
                  language={Language.Chinese}
                  onChange={(constraintType) => editModelTypeParameterConstraintType({ modelId: props.modelId, typeParameterId: typeParameter.id, constraintType })}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
