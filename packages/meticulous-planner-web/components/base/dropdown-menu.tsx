import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DropdownMenuProps = {
  children?: React.ReactNode;
  items: { label: string; onSelect: () => void }[];
  contentClassName?: string;
};

export function DropdownMenu(props: DropdownMenuProps) {
  return (
    <BaseDropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent className={props.contentClassName}>
        {props.items.map((item, index) => (
          <DropdownMenuItem key={index} onSelect={item.onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
}
