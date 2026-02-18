import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useModel, useProjectModels, useProjectModules } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { TypeReference } from '@/models/modeling/type-reference';
import { Language, ModelId, TypeReferenceType } from '@/models/modeling/values';
import { useState } from 'react';

export type TypeReferenceSelectorProps = {
  modelId: ModelId | null;
  language: Language;
  value: TypeReference | null;
  onChange?: (value: TypeReference | null) => void;
};

export function TypeReferenceSelector(props: TypeReferenceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { model } = useModel(props.modelId);
  const { modules } = useProjectModules(model?.projectId ?? null);
  const { models } = useProjectModels(model?.projectId ?? null);
  const modelsOfModules = Map.groupBy(models, (model) => model.moduleId);

  const label =
    props.value?.type === TypeReferenceType.Model
      ? models.find((model) => model.id === props.value?.modelId)?.descriptions[props.language]?.name
      : props.value?.type === TypeReferenceType.TypeParameter
        ? model?.typeParameters.find((typeParameter) => typeParameter.id === props.value?.typeParameterId)
            ?.descriptions[props.language]?.name
        : '';

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchText('');
        }
      }}
    >
      <PopoverTrigger>
        <span className={cn('cursor-pointer underline', { 'opacity-50': !label })}>{label || '某模型'}</span>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-36">
        <Command className="space-y-2">
          <CommandInput placeholder="搜尋" className="h-9" onValueChange={setSearchText} value={searchText} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs text-muted-foreground text-center">沒有找到結果</p>
              </div>
            </CommandEmpty>
            {model && (
              <CommandGroup heading={model.descriptions[props.language]?.name}>
                {model.typeParameters.map((typeParameter) => (
                  <CommandItem
                    key={typeParameter.id}
                    value={`${typeParameter.descriptions[props.language]?.name}/${typeParameter.id}/${model.descriptions[props.language]?.name}`}
                    onSelect={() => props.onChange?.(TypeReference.createTypeParameter(model.id, typeParameter.id))}
                    data-checked={
                      props.value?.type === TypeReferenceType.TypeParameter &&
                      props.value?.typeParameterId === typeParameter.id
                        ? 'true'
                        : 'false'
                    }
                  >
                    {typeParameter.descriptions[props.language]?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {modelsOfModules.entries().map(([moduleId, items]) => {
              const modelModule = modules.find((module) => module.id === moduleId);

              if (!modelModule) {
                return;
              }

              return (
                items && (
                  <CommandGroup key={moduleId} heading={modelModule.descriptions[props.language]?.name}>
                    {items.map((modelOfModule) => {
                      return (
                        <CommandItem
                          key={String(modelOfModule.id)}
                          value={`${modelOfModule.descriptions[props.language]?.name}/${modelOfModule.id}/${modelModule.descriptions[props.language]?.name}`}
                          onSelect={() => props.onChange?.(TypeReference.createModel(modelOfModule.id))}
                          data-checked={
                            props.value?.type === TypeReferenceType.Model && props.value?.modelId === modelOfModule.id
                              ? 'true'
                              : 'false'
                          }
                        >
                          {modelOfModule.descriptions[props.language]?.name}
                          {modelOfModule.moduleId !== model?.moduleId
                            ? ` (${modelModule.descriptions[props.language]?.name})`
                            : ''}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
