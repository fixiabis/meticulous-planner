import { cn } from '@/lib/utils';

export type MoreTriggerProps = React.ComponentProps<'span'> & {
  pinned?: boolean;
};

/**
 * 區塊旁的「...」選單觸發點，以虛線外框提示可點擊。
 * pinned 時固定顯示（用於「暫無...」等空狀態），children 會以 placeholder 樣式顯示在「...」前，
 * 與「...」一起作為觸發範圍；未 pinned 時交由 className 控制（通常是 hover 才顯示），不顯示 children。
 */
export function MoreTrigger({ pinned, className, children, ...props }: MoreTriggerProps) {
  return (
    <span
      {...props}
      className={cn(
        'group/more cursor-pointer text-muted-foreground transition-colors hover:text-foreground',
        !pinned && className,
      )}
    >
      {pinned && children}
      <span className="ml-1 rounded border border-dashed px-1 transition-colors group-hover/more:border-solid group-hover/more:bg-accent group-hover/more:text-accent-foreground">
        ...
      </span>
    </span>
  );
}
