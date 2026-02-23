import { useModel } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId } from '@/models/modeling/values';
import { Fragment } from 'react';
import { TypeReferenceSelector } from './type-reference-selector';

export type TypeReferenceInputProps = {
  className?: string;
  typeParameterModelId: ModelId | null;
  language: Language;
  value: TypeReference | null;
  onChange?: (value: TypeReference | null) => void;
};

export function TypeReferenceInput(props: TypeReferenceInputProps) {
  const { model } = useModel(props.value?.modelId || null);

  return (
    <span className={cn('', props.className)}>
      <TypeReferenceSelector
        value={props.value || null}
        modelId={props.typeParameterModelId}
        language={props.language}
        onChange={props.onChange}
      />
      {(model?.typeParameters.length || 0) > 0 && `，該${model?.descriptions[props.language]?.name}：`}
      {model?.typeParameters.map((typeParameter, index) => (
        <Fragment key={typeParameter.id}>
          {index > 0 && '，'}
          {typeParameter.descriptions[props.language]?.name}是
          <TypeReferenceInput
            typeParameterModelId={props.typeParameterModelId}
            language={props.language}
            value={props.value?.typeArguments[typeParameter.id] || null}
            onChange={(value) => props.onChange?.(props.value?.editTypeArgument(typeParameter.id, value) || null)}
          />
        </Fragment>
      ))}
    </span>
  );
}
