import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type SelectorProps<TItem> = {
  className?: string;
  value: TItem | null;
  onChange?: (value: TItem | null) => void;
  placeholder?: string;
  items?: { label: string; value: TItem }[];
  valueStringify: (value: TItem) => string;
  groupedItems?: { label: string; items: { label: string; value: TItem }[] }[];
};

export function Selector<TItem>(props: SelectorProps<TItem>) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const selectedItem =
    props.value &&
    (props.items?.find((item) => props.valueStringify(item.value) === props.valueStringify(props.value!)) ||
      props.groupedItems
        ?.flatMap((group) => group.items)
        .find((item) => props.valueStringify(item.value) === props.valueStringify(props.value!)));

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
        <span className={cn('cursor-pointer underline', !selectedItem && 'opacity-50', props.className)}>
          {selectedItem ? selectedItem.label : props.placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-48">
        <Command className="space-y-2">
          <CommandInput placeholder="搜尋" className="h-9" value={searchText} onValueChange={setSearchText} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs text-muted-foreground text-center">沒有找到結果</p>
              </div>
            </CommandEmpty>
            {props.items?.map((item) => {
              return (
                <CommandItem
                  key={String(props.valueStringify(item.value))}
                  value={String(props.valueStringify(item.value))}
                  onSelect={() => props.onChange?.(item.value)}
                  data-checked={Boolean(
                    props.value && props.valueStringify(item.value) === props.valueStringify(props.value),
                  )}
                >
                  {item.label}
                </CommandItem>
              );
            })}
            {props.groupedItems?.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={String(props.valueStringify(item.value))}
                    value={String(props.valueStringify(item.value))}
                    onSelect={() => props.onChange?.(item.value)}
                    data-checked={Boolean(
                      props.value && props.valueStringify(item.value) === props.valueStringify(props.value),
                    )}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
