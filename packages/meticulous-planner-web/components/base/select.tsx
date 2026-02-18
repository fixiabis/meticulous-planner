import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectProps<TItem> = {
  value: TItem | null;
  onChange: (value: TItem | null) => void;
  placeholder?: string;
  items: { label: string; value: TItem }[];
  valueStringify: (value: TItem) => string;
};

export function Select<TItem>(props: SelectProps<TItem>) {
  return (
    <BaseSelect
      value={props.value !== null ? props.valueStringify(props.value) : undefined}
      onValueChange={(valueString) =>
        props.onChange?.(props.items.find((item) => props.valueStringify(item.value) === valueString)?.value ?? null)
      }
    >
      <SelectTrigger className="inline-block shadow-none border-none p-1 py-0 -m-1 my-0 [&>.lucide-chevron-down]:hidden [font-size:inherit] cursor-pointer text-black! underline">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.items.map((item) => (
          <SelectItem key={props.valueStringify(item.value)} value={props.valueStringify(item.value)}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );
}
