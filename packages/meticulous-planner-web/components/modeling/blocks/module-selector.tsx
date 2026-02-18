import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ModuleInfo } from '@/models/modeling/info/module-info';
import { Language, ModuleId } from '@/models/modeling/values';
import { useState } from 'react';

export type ModuleSelectorProps = {
  className?: string;
  language: Language;
  value: ModuleId | null;
  onChange?: (value: ModuleId | null) => void;
};

export function ModuleSelector(props: ModuleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ModuleInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const selectedItem = items.find((item) => item.id === props.value);

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
        <span className={cn('cursor-pointer underline', props.className)}>
          {selectedItem ? selectedItem.name : '某功能'}
        </span>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-36">
        <Command>
          <CommandInput placeholder="搜尋" className="h-9" onValueChange={setSearchText} value={searchText} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs text-muted-foreground text-center">沒有找到結果</p>
              </div>
            </CommandEmpty>
            {items.map((module) => {
              return (
                <CommandItem
                  key={String(module.id)}
                  value={String(module.id)}
                  onSelect={() => props.onChange?.(module.id)}
                >
                  {module.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
