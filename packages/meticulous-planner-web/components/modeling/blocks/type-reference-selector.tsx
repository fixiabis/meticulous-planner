import { BaseModelType, ModelId, ModuleId } from '@/models/modeling/values';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Language } from '@/models/modeling/values';
import { useState } from 'react';
import { ModelInfo } from '@/models/modeling/info/model-info';
import { useModel } from '@/hooks/modeling/use-model';
import { TypeReference } from '@/models/modeling/type-reference';

export type TypeReferenceSelectorProps = {
  moduleId: ModuleId | null;
  modelId: ModelId | null;
  language: Language;
  value: TypeReference | null;
  onChange?: (value: TypeReference | null) => void;
};

export function TypeReferenceSelector(props: TypeReferenceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ModelInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const selectedItem = items.find((item) => item.id === props.value?.modelId);
  const itemsOfModules = Object.groupBy(items, (item) => item.moduleId);
  const { model } = useModel(props.modelId);

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
        <span className="cursor-pointer underline">{selectedItem ? selectedItem.name : '某模型'}</span>
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
                    value={String(typeParameter.id)}
                    onSelect={() => props.onChange?.(TypeReference.createTypeParameter(model.id, typeParameter.id))}
                  >
                    {typeParameter.descriptions[props.language]?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {baseModelItems.map((item) => (
              <CommandItem
                key={item.type}
                value={String(item.type)}
                onSelect={() => props.onChange?.(TypeReference.createBaseModel(item.type))}
              >
                {item.name}
              </CommandItem>
            ))}
            {Object.entries(itemsOfModules).map(
              ([moduleId, items]) =>
                items && (
                  <CommandGroup key={moduleId} heading={items[0].moduleName}>
                    {items.map((model) => {
                      return (
                        <CommandItem
                          key={String(model.id)}
                          value={String(model.id)}
                          onSelect={() => props.onChange?.(TypeReference.createModel(model.id))}
                        >
                          {model.name}
                          {model.moduleId !== props.moduleId ? ` (${model.moduleName}功能)` : ''}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ),
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const baseModelItems = [
  { type: BaseModelType.None, name: '無' },
  { type: BaseModelType.String, name: '字串' },
  { type: BaseModelType.Integer, name: '整數' },
  { type: BaseModelType.Decimal, name: '小數' },
  { type: BaseModelType.Boolean, name: '是或否' },
  { type: BaseModelType.Date, name: '日期' },
  { type: BaseModelType.DateTime, name: '日期時間' },
  { type: BaseModelType.Time, name: '時間' },
  { type: BaseModelType.Awaitable, name: '需等待的模型' },
];
