import { cn } from '@/lib/utils';

export type CodeViewerProps = {
  className?: string;
};

export function CodeViewer(props: CodeViewerProps) {
  return <div className={cn('', props.className)}></div>;
}
