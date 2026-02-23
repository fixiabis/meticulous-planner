import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DropdownMenuProps = {
  children?: React.ReactNode;
  items: { label: string; onSelect: () => void }[];
};

export function DropdownMenu(props: DropdownMenuProps) {
  return (
    <BaseDropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {props.items.map((item, index) => (
          <DropdownMenuItem key={index} onSelect={item.onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
}
