import { ContentEditable } from '@/components/base/content-editable';
import { cn } from '@/lib/utils';
import { Model } from '@/models/modeling/model';
import { Language, ModelId } from '@/models/modeling/values';
import { useState } from 'react';
import { StereotypeSelect } from '../elements/stereotype-select';
import { ModuleSelector } from './module-selector';
import { TypeReferenceInput } from './type-reference-input';

export type EditModelFormProps = {
  className?: string;
};

export function EditModelForm(props: EditModelFormProps) {
  const [model, setModel] = useState(() => Model.create({ id: ModelId(crypto.randomUUID()) }));

  const name = (
    <ContentEditable
      className={cn({ 'inline-block min-w-24': !model.descriptions[Language.Chinese]?.name })}
      content={model.descriptions[Language.Chinese]?.name || ''}
      placeholder="模型名稱"
      onEditUpdate={(content) => setModel(model.rename(content, Language.Chinese))}
    />
  );

  return (
    <div className={cn('p-4 space-y-2', props.className)}>
      <h1 className="text-2xl font-bold">{name}</h1>
      <p>
        是<ModuleSelector language={Language.Chinese} value={model.moduleId} />
        中的
        <StereotypeSelect
          language={Language.Chinese}
          value={model.stereotype}
          onChange={(value) => setModel(model.editStereotype(value))}
        />
        ，是一種
        <TypeReferenceInput
          value={model.generalizationType}
          modelId={model.id}
          moduleId={model.moduleId}
          language={Language.Chinese}
          onChange={(value) => setModel(model.editGeneralizationType(value))}
        />
      </p>
    </div>
  );
}
