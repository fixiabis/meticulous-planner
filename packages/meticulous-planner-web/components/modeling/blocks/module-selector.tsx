import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useProjectModules } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { Language, ModuleId, ProjectId } from '@/models/modeling/values';
import { useState } from 'react';

export type ModuleSelectorProps = {
  className?: string;
  projectId: ProjectId;
  language: Language;
  value: ModuleId | null;
  onChange?: (value: ModuleId | null) => void;
};

export function ModuleSelector(props: ModuleSelectorProps) {
  const [open, setOpen] = useState(false);
  const { modules } = useProjectModules(props.projectId);
  const [searchText, setSearchText] = useState('');
  const selectedModule = modules.find((module) => module.id === props.value);

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
          {selectedModule ? selectedModule.descriptions[Language.Chinese]?.name : '某功能'}
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
            {modules.map((module) => {
              return (
                <CommandItem
                  key={String(module.id)}
                  value={String(module.id)}
                  onSelect={() => props.onChange?.(module.id)}
                >
                  {module.descriptions[Language.Chinese]?.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
