import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { EditModelForm } from '../blocks/edit-model-form';
import { CodeViewer } from '../elements/code-viewer';
import { ModelId } from '@/models/modeling/values';

export type ModelingSectionProps = {
  className?: string;
};

export function ModelingSection(props: ModelingSectionProps) {
  return (
    <div className={cn('w-full h-full', props.className)}>
      <ResizablePanelGroup className="w-full h-full">
        <ResizablePanel defaultSize={100}>
          <EditModelForm modelId={ModelId("sample")} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={0}>
          <CodeViewer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
