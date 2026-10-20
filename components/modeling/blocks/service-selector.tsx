import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSystemServices } from '@/hooks/modeling/queries';
import { cn } from '@/lib/utils';
import { Language, ServiceId, SystemId } from '@/models/modeling/values';
import { useState } from 'react';

export type ServiceSelectorProps = {
  className?: string;
  systemId: SystemId;
  language: Language;
  value: ServiceId | null;
  onChange?: (value: ServiceId | null) => void;
};

export function ServiceSelector(props: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const { services: services } = useSystemServices(props.systemId);
  const [searchText, setSearchText] = useState('');
  const selectedService = services.find((services) => services.id === props.value);
  const labels = LABELS[props.language];

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
        <span className={cn('cursor-pointer underline', !selectedService && 'opacity-50', props.className)}>
          {selectedService ? selectedService.descriptions[props.language]?.name : labels.placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-48">
        <Command className="space-y-2">
          <CommandInput placeholder={labels.searchPlaceholder} className="h-9" onValueChange={setSearchText} value={searchText} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs text-muted-foreground text-center">{labels.noResults}</p>
              </div>
            </CommandEmpty>
            {services.map((service) => {
              return (
                <CommandItem
                  key={String(service.id)}
                  value={String(service.id)}
                  onSelect={() => props.onChange?.(service.id)}
                >
                  {service.descriptions[props.language]?.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type Labels = {
  placeholder: string;
  searchPlaceholder: string;
  noResults: string;
};

const LABELS: Record<Language, Labels> = {
  [Language.Chinese]: {
    placeholder: '某服務',
    searchPlaceholder: '搜尋',
    noResults: '沒有找到結果',
  },
  [Language.English]: {
    placeholder: 'a service',
    searchPlaceholder: 'Search',
    noResults: 'No results',
  },
  [Language.Technical]: {
    placeholder: '[service]',
    searchPlaceholder: 'search',
    noResults: 'no-results',
  },
};
